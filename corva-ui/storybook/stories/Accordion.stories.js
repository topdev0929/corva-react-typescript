/* eslint-disable react/prop-types */
import {
  Accordion as AccordionComponent,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import starImage from '../assets/star.png';

export const Accordion = props => (
  <AccordionComponent>
    <AccordionSummary
      className={classNames(props.size, props.arrowPosition)}
      expandIcon={<ExpandMoreIcon />}
    >
      {props.label}
    </AccordionSummary>
    <AccordionDetails>
      <>
        <div>Some content</div>
        <img src={starImage} alt="Star" />
      </>
    </AccordionDetails>
  </AccordionComponent>
);

export default {
  title: 'Components/Accordion',
  component: Accordion,
  argTypes: {
    label: {
      control: 'text',
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'large'],
    },
    arrowPosition: {
      control: 'inline-radio',
      options: ['left', 'right', 'stretched'],
    },
  },
  args: {
    label: 'Label',
    size: 'small',
    arrowPosition: 'left',
  },
  parameters: {
    docs: {
      description: {
        component:
          '<div>A wrapper around MUI Accordion component. More information <a href="https://v4.mui.com/components/accordion/#accordion">here</a></div>',
      },
    },
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9694%3A0',
  },
};
