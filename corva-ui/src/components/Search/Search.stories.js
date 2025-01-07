/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import SearchComponent from './Search';
import { RecentSearches, InputAdornmentLeft, Groups } from './components';

const GROUPS = [
  {
    id: 'well',
    name: 'Wells',
  },
  {
    id: 'pad',
    name: 'Pads',
  },
  {
    id: 'rig',
    name: 'Rigs',
  },
  {
    id: 'frac_fleet',
    name: 'Frac Fleets',
  },
  {
    id: 'drillout_unit',
    name: 'Drillout Units',
  },
  {
    id: 'api_number',
    name: 'API#',
  },
];

const loadData = ({ withGroups, includeLongLabel }) =>
  new Promise(resolve => {
    setTimeout(() => {
      const groupAPI = withGroups ? 'API#' : undefined;
      const groupWells = withGroups ? 'Wells' : undefined;
      const options = [
        {
          label: 'test1',
          id: 'test1',
          group: groupAPI,
        },
        {
          label: 'test2',
          id: 'test2',
          group: groupAPI,
        },
        {
          label: 'test3',
          id: 'test3',
          group: groupAPI,
        },
        {
          label: 'test4',
          id: 'test4',
          group: groupAPI,
        },
        {
          label: 'test5',
          id: 'test5',
          group: groupWells,
        },
        {
          label: 'test6',
          id: 'test6',
          group: groupWells,
        },
      ];
      if (includeLongLabel) {
        options.push(
          { label: 'Pad A Well Well Well 1234- 5', id: '10' },
          { label: 'Pad A Well Well Well 1234- 5', id: '11' }
        );
      }
      resolve(options);
    }, 1000);
  });

const useLoadedOptions = (
  { withGroups, includeLongLabel } = { withGroups: true, includeLongLabel: false }
) => {
  const [options, setOptions] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    setLoading(true);
    const loadedData = await loadData({ withGroups, includeLongLabel });

    setOptions(loadedData);
    setLoading(false);
  }, []);

  return {
    options,
    loading,
  };
};

export const Search = ({ disabled }) => {
  const [searchValue, setSearchValue] = useState([]);

  return (
    <div
      style={{
        width: 500,
      }}
    >
      <SearchComponent
        value={searchValue}
        onChange={(event, selected) => {
          setSearchValue(selected);
        }}
        disabled={disabled}
        options={[
          {
            label: 'test1',
            id: 'test1',
          },
          {
            label: 'test2',
            id: 'test2',
          },
          {
            label: 'test3',
            id: 'test3',
          },
          {
            label: 'test4',
            id: 'test4',
          },
          {
            label: 'test5',
            id: 'test5',
          },
        ]}
        InputProps={{
          startAdornment: <InputAdornmentLeft />,
        }}
        RecentSearchesComponent={RecentSearches}
      />
    </div>
  );
};

Search.storyName = 'Search';

export const MultipleSearch = ({ disabled }) => {
  const [searchValue, setSearchValue] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(GROUPS[5]);
  const { options, loading } = useLoadedOptions();

  const handleGroupChange = newGroup => {
    setSelectedGroup(newGroup);
  };

  const handleGroupReset = () => {
    setSelectedGroup(null);
  };

  return (
    <div
      style={{
        width: 500,
      }}
    >
      <SearchComponent
        value={searchValue}
        onChange={(event, selected) => setSearchValue(selected)}
        disabled={disabled}
        multiple
        selectedGroup={selectedGroup}
        InputProps={{
          startAdornment: <InputAdornmentLeft />,
        }}
        loading={loading}
        options={options}
        onGroupChange={handleGroupChange}
        onGroupReset={handleGroupReset}
        RecentSearchesComponent={RecentSearches}
        GroupsComponent={Groups}
        groups={GROUPS}
      />
    </div>
  );
};

export const MultiplePadSearch = ({ disabled, disabledLastSelectedOption }) => {
  const [selectedValue, setSelectedValue] = useState([]);
  const { options, loading } = useLoadedOptions({ withGroups: false, includeLongLabel: true });

  useEffect(() => {
    if (options) setSelectedValue(options);
  }, [options]);

  return (
    <div style={{ width: 220 }}>
      <SearchComponent
        AutocompleteProps={{
          forcePopupIcon: true,
          getOptionDisabled: disabledLastSelectedOption
            ? option => {
                if (selectedValue.length !== 1) return false;

                return option?.id === selectedValue[0].id;
              }
            : undefined,
        }}
        disabled={disabled}
        loading={loading}
        multiple
        onChange={(event, selectedValue) => setSelectedValue(selectedValue)}
        options={options}
        optionSize="large"
        placeholder=""
        TextFieldProps={{ label: 'Pad' }}
        value={selectedValue}
      />
    </div>
  );
};

export const GroupSearch = ({ disabled }) => {
  const [searchValue, setSearchValue] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState();
  const { options, loading } = useLoadedOptions();

  const handleGroupChange = newGroup => {
    setSelectedGroup(newGroup);
  };

  const handleGroupReset = () => {
    setSelectedGroup(null);
  };

  return (
    <div
      style={{
        width: 500,
      }}
    >
      <SearchComponent
        value={searchValue}
        onChange={(event, selected) => {
          setSearchValue(selected);
        }}
        InputProps={{
          startAdornment: <InputAdornmentLeft />,
        }}
        selectedGroup={selectedGroup}
        disabled={disabled}
        loading={loading}
        options={options}
        onGroupChange={handleGroupChange}
        onGroupReset={handleGroupReset}
        RecentSearchesComponent={RecentSearches}
        GroupsComponent={Groups}
        groups={GROUPS}
      />
    </div>
  );
};

export default {
  title: 'Components/Search',
  component: SearchComponent,
  subcomponents: { MultipleSearch },
  parameters: {
    options: {
      showPanel: true,
    },
    sourceLink: 'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Search/Search.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=30300%3A122250',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    disabledLastSelectedOption: {
      control: 'boolean',
    },
  },
  args: {
    disabled: false,
    disabledLastSelectedOption: false,
  },
};
