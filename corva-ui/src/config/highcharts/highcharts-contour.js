/**
 * Highcharts plugin for contour curves
 *
 * Author: Paulo Costa
 */

export default function (H) {
  'use strict';

  var defaultOptions = H.getOptions(),
    defined = H.defined,
    each = H.each,
    find = H.find,
    pick = H.pick,
    extendClass = H.extendClass,
    merge = H.merge,
    seriesTypes = H.seriesTypes,
    wrap = H.wrap,
    perspective = H.perspective,
    eps = 0.0001,
    SVG_NS = 'http://www.w3.org/2000/svg',
    XLINK_NS = 'http://www.w3.org/1999/xlink',
    gradient_id = 0;

  /**
   * Extend the default options with map options
   */

  defaultOptions.plotOptions.contour = merge(defaultOptions.plotOptions.scatter, {
    marker: {
      radius: 0,
      fillColor: '#ffffff',
      states: {
        hover: {
          radius: defaultOptions.plotOptions.scatter.marker.radius,
        },
      },
    },
    states: {
      hover: {
        halo: {
          size: defaultOptions.plotOptions.scatter.marker.radius + 4,
          attributes: {
            fill: '#000000',
          },
          opacity: 0.5,
        },
      },
    },
    turboThreshold: 0,
  });

  // The Heatmap series type
  seriesTypes.contour = extendClass(seriesTypes.heatmap, {
    type: 'contour',
    hasPointSpecificOptions: true,
    getSymbol: seriesTypes.scatter.prototype.getSymbol,
    drawPoints: H.Series.prototype.drawPoints,
    pointClass: H.Point,
    pointAttribs: H.Series.prototype.pointAttribs,

    init: function (chart) {
      this.is3d = chart.is3d && chart.is3d();
      this.gradiend_ids = {};
      this.dataFuncState = {};
      seriesTypes.scatter.prototype.init.apply(this, arguments);
    },

    translate: function () {
      seriesTypes.scatter.prototype.translate.call(this, arguments);
      this.translateColors();
    },

    dataFunction: function (coord) {
      var result = this.options.dataFunction(coord);
      if (typeof result === 'number') {
        var ret = {};
        each(this.parallelArrays, function (axis) {
          ret[axis] = axis === 'value' ? result : pick(coord[axis], result);
        });
        return ret;
      } else if (typeof result === 'object') {
        return H.merge(coord, result);
      } else {
        return null;
      }
    },

    updateDataIfNecessary: function () {
      var series = this,
        axis1_type = pick(series.options.axis1, 'x'),
        axis2_type = pick(series.options.axis2, series.is3d ? 'z' : 'y'),
        axis1 = series[axis1_type + 'Axis'],
        axis2 = series[axis2_type + 'Axis'];

      if (
        !series.options.dataFunction ||
        !defined(axis1.min) ||
        !defined(axis1.max) ||
        !defined(axis2.min) ||
        !defined(axis2.max)
      ) {
        return;
      }

      var axis1_min = pick(axis1.min, axis1.options.min),
        axis2_min = pick(axis2.min, axis2.options.min),
        axis1_max = pick(axis1.max, axis1.options.max),
        axis2_max = pick(axis2.max, axis2.options.max),
        axis1_steps = pick(series.options.grid_width, series.options.grid_height, 21),
        axis2_steps = pick(series.options.grid_height, series.options.grid_width, 21);

      var newDataFuncState = {
        dataFunc: series.options.dataFunction,
        axis1_type: axis1_type,
        axis2_type: axis2_type,
        axis1_min: axis1_min,
        axis1_max: axis1_max,
        axis2_min: axis2_min,
        axis2_max: axis2_max,
        axis1_steps: axis1_steps,
        axis2_steps: axis2_steps,
      };
      var changes = H.cleanRecursively(newDataFuncState, series.dataFuncState);
      if (Object.keys(changes).length === 0) {
        return;
      }
      series.dataFuncState = newDataFuncState;

      var data = [];
      for (var j = 0; j < axis2_steps; j++) {
        for (var i = 0; i < axis1_steps; i++) {
          var coord = {};
          coord[axis1_type] = (i / (axis1_steps - 1)) * (axis1_max - axis1_min) + axis1_min;
          coord[axis2_type] = (j / (axis2_steps - 1)) * (axis2_max - axis2_min) + axis2_min;
          var point = this.dataFunction(coord);
          data.push(point);
        }
      }
      return seriesTypes.scatter.prototype.setData.call(this, data, true, false, false);
    },

    bindAxes: function () {
      if (this.is3d) {
        this.axisTypes = ['xAxis', 'yAxis', 'zAxis', 'colorAxis'];
        this.parallelArrays = ['x', 'y', 'z', 'value'];
      } else {
        this.axisTypes = ['xAxis', 'yAxis', 'colorAxis'];
        this.parallelArrays = ['x', 'y', 'value'];
      }
      seriesTypes.scatter.prototype.bindAxes.apply(this, arguments);
    },

    drawTriangle: function (
      triangle_data,
      edgeCount,
      show_faces,
      show_edges,
      show_triangles,
      contours
    ) {
      var fill;
      var series = this;
      var chart = this.chart;
      var renderer = this.chart.renderer;
      var a = triangle_data.A;
      var b = triangle_data.B;
      var c = triangle_data.C;
      var abc = [a, b, c];

      if (show_faces) {
        // Normalized values of the vertexes
        var values = [
            this.colorAxis.normalizedValue(a.value),
            this.colorAxis.normalizedValue(b.value),
            this.colorAxis.normalizedValue(c.value),
          ],
          maxValue = Math.max(values[0], values[1], values[2]),
          minValue = Math.min(values[0], values[1], values[2]),
          area = Math.abs(triangleArea(a, b, c));

        // All vertexes have the same value/color, or the triangle has a zero-ish area
        if (maxValue - minValue < eps || area < eps) {
          fill = this.colorAxis.toColor((a.value + b.value + c.value) / 3);
          // Use a linear gradient to interpolate values/colors
        } else {
          // Find function where "Value = A*X + B*Y + C" at the 3 vertexes
          var m = new Matrix([
            [a.plotX, a.plotY, 1, values[0]],
            [b.plotX, b.plotY, 1, values[1]],
            [c.plotX, c.plotY, 1, values[2]],
          ]);
          m.toReducedRowEchelonForm();
          var A = m.mtx[0][3];
          var B = m.mtx[1][3];
          var C = m.mtx[2][3];

          // For convenience, we place our gradient control points at (k*A, k*B)
          // We can find the value of K as:
          //   Value = A*X + B*Y + C =
          //   Value = A*(A*k) + B*(B*k) + C
          //   Value = A²*k + B²*k + C
          //   Value = k*(A² + B²) + C
          // k = (Value - C) / (A² + B²)
          var k0 = (0 - C) / (A * A + B * B);
          var k1 = (1 - C) / (A * A + B * B);
          var x1 = ensureDecimal(k0 * A);
          var y1 = ensureDecimal(k0 * B);
          var x2 = ensureDecimal(k1 * A);
          var y2 = ensureDecimal(k1 * B);

          // Assign a linear gradient that interpolates all 3 vertexes
          if (renderer.isSVG) {
            //SVGRenderer implementation of gradient is slow and leaks memory -- Lets do it ourselves
            var gradient = triangle_data.gradient;
            if (!gradient) {
              gradient = renderer.createElement('linearGradient');
              triangle_data.gradient = gradient;
              gradient.add(renderer.defs);
              gradient.attr({
                id: 'contour-gradient-id-' + gradient_id++,
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
              });
            } else {
              gradient.animate({
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
              });
            }
            gradient.element.setAttributeNS(XLINK_NS, 'xlink:href', this.base_gradient_id);
            fill = 'url(' + renderer.url + '#' + gradient.attr('id') + ')';
          } else {
            fill = {
              linearGradient: {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                spreadMethod: 'pad',
                gradientUnits: 'userSpaceOnUse',
              },
              stops: this.colorAxis.stops,
            };
          }
        }

        var path = ['M', a.plotX, a.plotY, 'L', b.plotX, b.plotY, 'L', c.plotX, c.plotY, 'Z'];

        if (triangle_data.shape) {
          triangle_data.shape
            .animate({
              d: path,
            })
            .attr({
              fill: fill,
            });

          if (triangle_data.shape.parent != triangle_data.group) {
            triangle_data.shape.add(triangle_data.group);
          }
        } else {
          triangle_data.shape = renderer.path(path).attr({
            'shape-rendering': 'crispEdges',
            fill: fill,
          });
          triangle_data.shape.on('mousemove', function (e) {
            e = chart.pointer.normalize(e);
            if (chart.inverted) {
              var mx = chart.plotTop + chart.plotHeight - e.chartY;
              var my = chart.plotLeft + chart.plotWidth - e.chartX;
            } else {
              var mx = e.chartX - chart.plotLeft;
              var my = e.chartY - chart.plotTop;
            }

            if (series.options.interpolateTooltip) {
              //Find an interpolated point on [X, Y, Z, Value] right under the mouse
              var m = new Matrix([
                [a.plotX, a.plotY, 1, a.x, a.y, a.z, a.value],
                [b.plotX, b.plotY, 1, b.x, b.y, b.z, b.value],
                [c.plotX, c.plotY, 1, c.x, c.y, c.z, c.value],
              ]);
              m.toReducedRowEchelonForm();
              var interpolated = {
                x: axisRound(series.xAxis, m.mtx[0][3] * mx + m.mtx[1][3] * my + m.mtx[2][3]),
                y: axisRound(series.yAxis, m.mtx[0][4] * mx + m.mtx[1][4] * my + m.mtx[2][4]),
                z: axisRound(series.zAxis, m.mtx[0][5] * mx + m.mtx[1][5] * my + m.mtx[2][5]),
                value: m.mtx[0][6] * mx + m.mtx[1][6] * my + m.mtx[2][6],
              };

              //If the series has a dataFunction, use it to calculate
              //an exact value at the Interpolated point
              if (series.options.dataFunction) {
                interpolated = series.dataFunction(interpolated);
              }

              var interpolatedPoint = new H.Point().init(series);
              interpolatedPoint.applyOptions(interpolated);

              //interpolatedPoint.plotX = mx;
              //interpolatedPoint.plotY = my;
              var dataBackup = series.data;
              series.data = [interpolatedPoint];
              series.translate();
              series.data = dataBackup;

              chart.tooltip.refresh(interpolatedPoint, e);
            } else {
              var dist = function (P) {
                return (P.plotX - mx) * (P.plotX - mx) + (P.plotY - my) * (P.plotY - my);
              };
              var nearest = triangle_data.A;
              if (dist(triangle_data.B) < dist(nearest)) {
                nearest = triangle_data.B;
              }
              if (dist(triangle_data.C) < dist(nearest)) {
                nearest = triangle_data.C;
              }
              nearest.onMouseOver(e);
            }
          });
          triangle_data.shape.add(triangle_data.group);
        }
      } else if (triangle_data.shape) {
        triangle_data.shape.destroy;
        delete triangle_data.shape;
      }

      // Draw edges around the triangle and/or on contour curves

      var edge_path = triangle_data.group.edge_path;
      var edge_path_old = triangle_data.group.edge_path_old;

      if (show_edges || show_triangles) {
        var processEdge = function (a, b, A, B) {
          if (!edgeCount[b + '-' + a]) {
            if (edgeCount[a + '-' + b]-- == 1) {
              edge_path.push('M', A.plotX, A.plotY, 'L', B.plotX, B.plotY);
              edge_path_old.push('M', A.plotX_prev, A.plotY_prev, 'L', B.plotX_prev, B.plotY_prev);
            }
          } else if (show_triangles) {
            edgeCount[a + '-' + b]--;
          }
        };
        processEdge(triangle_data.a, triangle_data.b, triangle_data.A, triangle_data.B);
        processEdge(triangle_data.b, triangle_data.c, triangle_data.B, triangle_data.C);
        processEdge(triangle_data.c, triangle_data.a, triangle_data.C, triangle_data.A);
      }

      for (var contour_index = 0; contour_index < contours.length; contour_index++) {
        var contourAxis = contours[contour_index].axis;
        var contourAttr = contours[contour_index].attr;

        for (var tickIndex in contourAxis.tickPositions) {
          var tickValue = contourAxis.tickPositions[tickIndex];
          var contourVertexes = [];
          for (var i = 0; i < 3; i++) {
            var x1 = abc[i].plotX,
              x1_prev = abc[i].plotX_prev,
              y1 = abc[i].plotY,
              y1_prev = abc[i].plotY_prev,
              v1 = abc[i][contourAttr],
              x2 = abc[(i + 1) % 3].plotX,
              x2_prev = abc[(i + 1) % 3].plotX_prev,
              y2 = abc[(i + 1) % 3].plotY,
              y2_prev = abc[(i + 1) % 3].plotY_prev,
              v2 = abc[(i + 1) % 3][contourAttr];

            if (v1 != v2 && tickValue >= Math.min(v1, v2) && tickValue < Math.max(v1, v2)) {
              var q = (tickValue - v1) / (v2 - v1);
              contourVertexes.push([
                q * (x2 - x1) + x1,
                q * (y2 - y1) + y1,
                q * (x2_prev - x1_prev) + x1_prev,
                q * (y2_prev - y1_prev) + y1_prev,
              ]);
            }
          }
          if (contourVertexes.length == 2) {
            edge_path.push(
              'M',
              contourVertexes[0][0],
              contourVertexes[0][1],
              'L',
              contourVertexes[1][0],
              contourVertexes[1][1]
            );
            edge_path_old.push(
              'M',
              contourVertexes[0][2],
              contourVertexes[0][3],
              'L',
              contourVertexes[1][2],
              contourVertexes[1][3]
            );
          }
        }
      }
    },

    assignGroups: function () {
      var series = this;
      for (var i = 0; i < series.triangles.length; i++) {
        series.triangles[i].group_id = series.is3d ? i : 0;

        //TODO: On 3D, group faces that form a continuous surface
      }

      //Add group on the SVG
      var new_groups = {};
      var old_groups = series.groups;

      for (var i = 0; i < series.triangles.length; i++) {
        var triangle = series.triangles[i];
        var group_id = triangle.group_id;

        if (old_groups[group_id]) {
          new_groups[group_id] = old_groups[group_id];
          new_groups[group_id].zSum = 0;
          new_groups[group_id].triangle_count = 0;
          delete old_groups[group_id];
        } else if (!new_groups[group_id]) {
          new_groups[group_id] = series.chart.renderer.g().add(this.surface_group);
          new_groups[group_id].zSum = 0;
          new_groups[group_id].triangle_count = 0;
        }

        series.triangles[i].group = new_groups[group_id];
        new_groups[group_id].zSum += triangle.A.plotZ + triangle.B.plotZ + triangle.C.plotZ;
        new_groups[group_id].triangle_count++;
      }

      //Assign Z-Index of new groups as the mean Z of all triangles
      H.objectEach(new_groups, function (group, group_id) {
        group.attr({
          zIndex: -group.zSum / (3 * group.triangle_count),
        });
      });

      //Remove old groups from SVG
      H.objectEach(old_groups, function (group) {
        group.destroy();
      });
      series.groups = new_groups;
    },

    drawGraph: function () {
      this.updateDataIfNecessary();

      var series = this,
        i,
        j,
        points = series.points,
        options = this.options,
        renderer = series.chart.renderer;

      if (!series.surface_group) {
        series.surface_group = renderer.g().add(series.group);
        series.triangles = [];
        series.groups = {};
      }

      // When creating a SVG, we create a "base" gradient with the right colors,
      // And extend it on every triangle to define the orientation.
      if (series.chart.renderer.isSVG) {
        var gradiend_id = '';
        for (var i = 0; i < this.colorAxis.stops.length; i++) {
          for (var j = 0; j < this.colorAxis.stops[i].length; j++) {
            gradiend_id += ':' + this.colorAxis.stops[i][j];
          }
        }
        if (!this.gradiend_ids[gradiend_id]) {
          var fake_rect = series.chart.renderer.rect(0, 0, 1, 1).attr({
            fill: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 1,
                y2: 0,
                spreadMethod: 'pad',
                gradientUnits: 'userSpaceOnUse',
              },
              stops: this.colorAxis.stops,
            },
          });
          this.gradiend_ids[gradiend_id] = /(#.*)[)]/.exec(fake_rect.attr('fill'))[1];
        }
        this.base_gradient_id = this.gradiend_ids[gradiend_id];
      }

      var group = series.surface_group;
      var triangle_count = 0;

      var egde_count = {};
      var validatePoint = function (p) {
        return (
          p &&
          typeof p.x === 'number' &&
          typeof p.y === 'number' &&
          (typeof p.z === 'number' || !series.is3d) &&
          typeof p.value === 'number'
        );
      };
      var appendEdge = function (a, b) {
        egde_count[a + '-' + b] = (egde_count[a + '-' + b] || 0) + 1;
      };
      var appendTriangle = function (a, b, c) {
        if (validatePoint(points[a]) && validatePoint(points[b]) && validatePoint(points[c])) {
          if (series.is3d) {
            // Ensure all triangles are counter-clockwise.
            // This is used to detect "3D wrap-around" edges.
            var area = triangleArea(points[a], points[b], points[c]);
            if (area < 0) {
              var tmp = a;
              a = b;
              b = tmp;
            }
          }

          var triangle_data = series.triangles[triangle_count];
          if (!triangle_data) {
            triangle_data = series.triangles[triangle_count] = {};
          }
          triangle_count++;

          triangle_data.a = a;
          triangle_data.b = b;
          triangle_data.c = c;

          triangle_data.A = points[a];
          triangle_data.B = points[b];
          triangle_data.C = points[c];

          appendEdge(a, b);
          appendEdge(b, c);
          appendEdge(c, a);
        }
      };

      var triangles = [];
      if (options.triangles) {
        for (i = 0; i < options.triangles.length; i++) {
          var v = options.triangles[i];
          if (typeof v === 'number') {
            triangles.push(v);
          } else if (
            typeof v === 'object' &&
            typeof v[0] === 'number' &&
            typeof v[1] === 'number' &&
            typeof v[2] === 'number'
          ) {
            triangles.push(v[0], v[1], v[2]);
          }
        }
      } else if (options.grid_width) {
        //points are in a nice regular grid
        var grid_width = options.grid_width;
        for (i = 1; i < points.length / grid_width; i++) {
          for (j = 1; j < options.grid_width && i * grid_width + j < points.length; j++) {
            var i00 = (i - 1) * grid_width + (j - 1);
            var i01 = (i - 1) * grid_width + j;
            var i10 = i * grid_width + (j - 1);
            var i11 = i * grid_width + j;

            if (
              this.is3d &&
              Math.abs(points[i00].value - points[i11].value) <
                Math.abs(points[i01].value - points[i10].value)
            ) {
              triangles.push(i00, i01, i11);
              triangles.push(i00, i11, i10);
            } else {
              triangles.push(i00, i01, i10);
              triangles.push(i01, i11, i10);
            }
          }
        }
      } else {
        //If points are not in a regular grid, use Delaunay triangulation.
        //You will have to include this: https://github.com/ironwallaby/delaunay
        points = points.filter(validatePoint);
        triangles = Delaunay.triangulate(
          points.map(
            this.is3d
              ? function (x) {
                  return [x.axisXpos, x.axisZpos];
                }
              : function (x) {
                  return [x.plotX, x.plotY];
                }
          )
        );
      }

      for (i = 0; i < triangles.length - 2; i += 3) {
        appendTriangle(triangles[i], triangles[i + 1], triangles[i + 2]);
      }

      // Remove extra unused triangles from previous rendering
      for (i = triangle_count; i < series.triangles.length; i++) {
        if (series.triangles[i].shape) {
          series.triangles[i].shape.destroy();
        }
        if (series.triangles[i].edge) {
          series.triangles[i].edge.destroy();
        }
        if (series.triangles[i].gradient) {
          series.triangles[i].gradient.destroy();
        }
      }
      series.triangles.splice(triangle_count, series.triangles.length - triangle_count);

      //Assign triangles in groups (drawing layers)
      this.assignGroups();
      H.objectEach(series.groups, function (group) {
        group.edge_path_old = [];
        group.edge_path = [];
      });

      var contours = [];
      if (options.contours) {
        H.each(options.contours, function (contourName) {
          switch (contourName) {
            case 'x':
              contours.push({ axis: series.xAxis, attr: 'x' });
              break;
            case 'y':
              contours.push({ axis: series.yAxis, attr: 'y' });
              break;
            case 'z':
              contours.push({ axis: series.zAxis, attr: 'z' });
              break;
            case 'value':
              contours.push({ axis: series.colorAxis, attr: 'value' });
              break;
          }
        });
      } else if (options.showContours) {
        contours.push({ axis: series.colorAxis, attr: 'value' });
      }

      // Render each triangle
      for (i = 0; i < triangle_count; i++) {
        series.drawTriangle(
          series.triangles[i],
          egde_count,
          pick(options.showFaces, true),
          pick(options.showEdges, false),
          pick(options.showTriangles, false),
          contours
        );
      }

      // Render edges
      H.objectEach(series.groups, function (group) {
        if (group.edge_path.length) {
          if (group.edges) {
            group.edges
              .attr({
                d: group.edge_path_old,
              })
              .animate({
                d: group.edge_path,
              });
          } else {
            group.edges = renderer.path(group.edge_path).attr({
              'stroke-linecap': 'round',
              stroke: 'black',
              'stroke-width': 1,
              zIndex: 1,
            });
            group.edges.add(group);
          }
        } else if (group.edges) {
          group.edges.destroy();
          delete group.edges;
        }
      });

      //Prepare point for next rendering
      H.each(points, function (point) {
        point.plotX_prev = point.plotX;
        point.plotY_prev = point.plotY;
        point.plotZ_prev = point.plotZ;
      });
    },
  });

  var triangleArea = function (a, b, c) {
    return (
      (a.plotX * (b.plotY - c.plotY) +
        b.plotX * (c.plotY - a.plotY) +
        c.plotX * (a.plotY - b.plotY)) /
      2
    );
  };

  /**
   * Round tiny numbers to 0, as scientific notation isn't handled by SVG
   */
  var ensureDecimal = function (num) {
    if (num >= -1e-6 && num <= 1e-6) {
      return 0;
    }
    return num;
  };

  /**
   * Smart-rounding of axis values, where the precision depends on the axis slope.
   */
  var axisRound = function (axis, value) {
    if (!axis) {
      return value;
    }
    var valueMin = axis.toValue(axis.toPixels(value) - 0.5);
    var valueMax = axis.toValue(axis.toPixels(value) + 0.5);
    var valueInterval = Math.abs(valueMax - valueMin);
    var roundedValueInterval = H.normalizeTickInterval(
      valueInterval,
      [1, 2, 5, 10],
      H.getMagnitude(valueInterval),
      true
    );
    var roundValue = H.correctFloat(
      roundedValueInterval * Math.round(value / roundedValueInterval)
    );
    return roundValue;
  };

  /**
   * Matrix class
   * Based on:
   * - http://rosettacode.org/wiki/Matrix_Transpose#JavaScript
   * - http://rosettacode.org/wiki/Reduced_row_echelon_form#JavaScript
   */
  function Matrix(ary) {
    this.mtx = ary;
    this.height = ary.length;
    this.width = ary[0].length;
  }

  Matrix.prototype.toReducedRowEchelonForm = function () {
    for (var col = 0; col < this.width && col < this.height; col++) {
      var bestRow = null;
      var bestRowVal = 0;
      for (var row = col; row < this.height; row++) {
        if (Math.abs(this.mtx[row][col]) > bestRowVal) {
          bestRow = row;
          bestRowVal = Math.abs(this.mtx[row][col]);
        }
      }

      //All zeros in this column :(
      if (bestRow == null) {
        for (var row = 0; row < this.height; row++) {
          this.mtx[row][col] = 0;
        }
        continue;
      }

      //Swap rows
      var tmp = this.mtx[col];
      this.mtx[col] = this.mtx[bestRow];
      this.mtx[bestRow] = tmp;

      //Normalize
      for (var row = 0; row < this.height; row++) {
        if (row == col) {
          //Normalize reference row last, for numeric stability
          continue;
        }
        var k = this.mtx[row][col] / this.mtx[col][col];
        for (var i = col; i < this.width; i++) {
          this.mtx[row][i] -= k * this.mtx[col][i];
        }
      }

      //Normalize reference row now
      var k = this.mtx[col][col];
      for (var i = col; i < this.width; i++) {
        this.mtx[col][i] /= k;
      }

      //Normalize this column for numeric stability
      for (var row = 0; row < this.height; row++) {
        this.mtx[row][col] = row == col ? 1 : 0;
      }
    }
    return this;
  };

  Matrix.prototype.toString = function () {
    var s = [];
    for (var i = 0; i < this.mtx.length; i++) {
      s.push(this.mtx[i].join(','));
    }
    return s.join('\n');
  };

  /**
   * Contour axis
   * Just add an extra axis with `contourAxis: true` and it will display labels for 'value' at the intersection with the contour curves
   */

  var contourAxisGetCoordinate = function (axis, pixels) {
    var x, y;
    var xAxis = axis.contourSeries.xAxis;
    var yAxis = axis.contourSeries.yAxis;
    if (axis.isXAxis) {
      x = xAxis.toValue(pixels, true);
      y = yAxis.toValue(!axis.opposite !== !axis.chart.inverted ? 0 : yAxis.len, true);
    } else {
      x = xAxis.toValue(!axis.opposite !== !axis.chart.inverted ? xAxis.len : 0, true);
      y = yAxis.toValue(pixels, true);
    }
    return {
      x: x,
      y: y,
    };
  };

  var contourAxisTickPositioner = function () {
    var axis = this;
    var contourSeries = axis.contourSeries;
    if (!contourSeries) {
      contourSeries = find(axis.chart.series, function (serie) {
        if (axis.options.serie) {
          return (
            serie.id === axis.options.serie ||
            (serie.options && serie.options.id === axis.options.serie)
          );
        } else {
          return serie.type === 'contour';
        }
      });
      if (!contourSeries) {
        H.error(17, false);
        return [];
      }
      axis.contourSeries = contourSeries;
      each(contourSeries.axisTypes || [], function (AXIS) {
        wrap(contourSeries[AXIS], 'setTickPositions', function (proceed) {
          proceed.apply(this, [].slice.call(arguments, 1));
          axis.forceRedraw = true;
          axis.setScale();
        });
      });
    }
    var valueTicks = contourSeries.colorAxis.tickPositions;
    if (!valueTicks || valueTicks.length === 0) return [];
    var x1, v1;
    var ret = [];
    var labels = {};
    for (var i = 0; i <= axis.len; i++) {
      var x2 = axis.toValue(i, true);
      var v2 = contourSeries.dataFunction(contourAxisGetCoordinate(axis, i)).value;
      if (i > 0 && v1 !== v2) {
        for (var tickIndex in valueTicks) {
          var tickValue = valueTicks[tickIndex];
          if (tickValue >= Math.min(v1, v2) && tickValue <= Math.max(v1, v2)) {
            var q = (tickValue - v1) / (v2 - v1);
            var pos = q * (x2 - x1) + x1;
            ret.push(pos);
            labels[pos] = tickValue;
          }
        }
      }
      x1 = x2;
      v1 = v2;
    }

    axis._contourAxisLabels = labels;
    return ret;
  };

  wrap(H.Axis.prototype, 'setOptions', function (proceed, userOptions) {
    if (userOptions.contourAxis) {
      userOptions = merge(
        {
          tickWidth: 1,
          tickColor: 'black',
          title: {
            text: null,
          },
        },
        userOptions,
        {
          min: 0,
          max: 1,
          startOnTick: false,
          endOnTick: false,
          tickPositioner: contourAxisTickPositioner,
        }
      );
    }

    return proceed.call(this, userOptions);
  });

  wrap(H.Axis.prototype, 'init', function (proceed, chart, options) {
    proceed.apply(this, [].slice.call(arguments, 1));
    if (this.options.tickPositioner === contourAxisTickPositioner) {
      var oldFormatter = this.labelFormatter;
      this.labelFormatter = function () {
        this.value = this.axis._contourAxisLabels[this.value];
        return oldFormatter.call(this);
      };
    }
  });
}
