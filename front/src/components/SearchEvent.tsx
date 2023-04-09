import React from 'react'
import { SearchIcon } from '@chakra-ui/icons'
import { Button, ChakraProvider, IconButton, Input, Stack, useOutsideClick } from '@chakra-ui/react'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import NumberSelector from './NumberSelector'
import InputDateRangePicker from './InputDateRangePicker'
import { SaveOutlined } from '@mui/icons-material'
import styles from '@styledComponentStyle/SearchEvent.module.css'
import InputSelectDropdown from './InputSelectDropdown'
import { INumberSelectorData } from '@interfaces/number-selector'
import { ISelectedInputDropdownData } from '@interfaces/input-select-dropdown'
import { useAppDispatch, useAppSelector } from 'src/store/hook'
import { saveSearch } from 'src/store/slices/searchSlice'
import { IClassName } from '@interfaces/className'
import { getAccomodation$, getRestaurant$, getBar$, getEvent$ } from 'src/store/slices/apiCallSlice'

export default function SearchEvent({ className }: IClassName) {
  const ref = React.useRef(null)
  const dispatch = useAppDispatch()
  const refInputSearch = React.useRef(null)
  const searchStore = useAppSelector(state => state.search)
  const dateStore = useAppSelector(state => state.dateSearch)
  const [hasSomethingChanged, setHasSomethingChanged] = React.useState(false)
  const [inputSearchValue, setInputSearchValue] = React.useState<string>(searchStore.searchValue ?? "")
  const [isDropdownOpen, setDropdownOpen] = React.useState(false)
  const [selectedDataNumberSelector, setSelectedDataNumberSelector] = React.useState<
    INumberSelectorData[]
  >(searchStore.travelers && searchStore.travelers.length ? searchStore.travelers : [
    {
      id: 1,
      name: 'Adulte',
      apiName: 'adult',
      min: 0,
      number: 0,
    },
    {
      id: 2,
      name: 'Enfant',
      apiName: 'children',
      min: 0,
      number: 0,
    },
  ])
  const [selectedDropdownData, setSelectedDropdownData] = React.useState<
    ISelectedInputDropdownData[]
  >(searchStore.selectedTypes)
  const isAllPropertiesRequiredPresent = () => {
    if (
      inputSearchValue &&
      inputSearchValue.trim() !== '' &&
      selectedDataNumberSelector.length !== 0 &&
      selectedDataNumberSelector.some(data => data.number !== 0) &&
      selectedDropdownData.length !== 0 &&
      dateStore.isDateSet
    ) {
      return true
    }
    return false
  }

  function handleSetInputSearchValue(value: string) {
    setInputSearchValue(value);
    setHasSomethingChanged(true);
  }

  function handleSetSelectedDataNumberSelector(data: INumberSelectorData[]) {
    setSelectedDataNumberSelector(data);
    setHasSomethingChanged(true);
  }

  function handleSetSelectedDropdownData(data: ISelectedInputDropdownData[]) {
    setSelectedDropdownData(data);
    setHasSomethingChanged(true);
  }

  function handleDropdownOpen() {
    if (!isDropdownOpen) {
      (refInputSearch.current as unknown as HTMLInputElement).focus()
      setDropdownOpen(true)
    }
  }

  function handleClick() {
    if (isAllPropertiesRequiredPresent()) {
      // API Request
      selectedDropdownData.forEach((data) => {
        let response = null;
        switch (data.apiName) {
          case "accomodation":
            response = dispatch(getAccomodation$(inputSearchValue));
            break;

          case "restaurant":
            response = dispatch(getRestaurant$(inputSearchValue));
            break;

          case "bar":
            response = dispatch(getBar$(inputSearchValue));
            break;

          case "event":
            response = dispatch(getEvent$(inputSearchValue));
            break;

          default:
            response = dispatch(getEvent$(inputSearchValue));
            break;
        }
        response.unwrap().then((value) => {
          console.log(value);
        })
      })
    } else {
      alert('Toute les items ne sont pas présent');
    }
  }

  function handleSaveSearch() {
    if (isAllPropertiesRequiredPresent()) {
      dispatch(saveSearch({
        date: {
          end: dateStore.end,
          start: dateStore.start,
          isDateSet: dateStore.isDateSet
        },
        travelers: selectedDataNumberSelector,
        selectedTypes: selectedDropdownData,
        searchValue: inputSearchValue
      }));
    }
  }

  useOutsideClick({
    ref: ref,
    handler: () => setDropdownOpen(false),
  })

  return (
    <div ref={ref} className={`${styles.seContainer} ${className ?? ''}`} data-testid="se-container">
      <div className={styles.seHeader} onClick={handleDropdownOpen} data-testid="se-header">
        <div className={styles.seHeaderGroup} data-testid="se-header-group-one">
          <ChakraProvider>
            <SearchIcon fontSize="x-large" data-testid="se-header-icon-search" />
            <Input
              ref={refInputSearch}
              value={inputSearchValue}
              onChange={event => handleSetInputSearchValue(event.target.value)}
              variant="unstyled"
              placeholder="Where would you like to go?"
              data-testid="se-header-input"
            />
          </ChakraProvider>
        </div>
        <div className={styles.seHeaderGroup} data-testid="se-header-group-two">
          <IconButton
            aria-label="tune"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            data-testid="se-header-icon-config">
            <TuneRoundedIcon />
          </IconButton>
        </div>
      </div>
      <div
        className={`${styles.seBody} ${isDropdownOpen ? styles.open : ''}`}
        data-testid="se-body">
        {isDropdownOpen ? (
          <>
            <InputSelectDropdown
              data-testid="se-body-input-select-dropdown"
              className={styles.seSelectType}
              data={[
                {
                  id: 1,
                  name: 'Logement',
                  apiName: 'accomodation',
                },
                {
                  id: 2,
                  name: 'Restaurant',
                  apiName: 'restaurant',
                },
                {
                  id: 3,
                  name: 'Bar',
                  apiName: 'bar',
                },
                {
                  id: 4,
                  name: 'Événement',
                  apiName: 'event',
                },
              ]}
              selectedData={selectedDropdownData}
              onSelectedChange={data => handleSetSelectedDropdownData(data)}
            />
            <NumberSelector
              data-testid="se-body-number-selector"
              className={styles.seSelectNumberTraveler}
              title="Voyageur"
              items={selectedDataNumberSelector}
              onChange={data => handleSetSelectedDataNumberSelector(data)}
            />
            <InputDateRangePicker
              className={styles.seDatePicker}
              data-testid="se-body-input-date-range-picker"
            />
            <div className={styles.seBodyButtonAction}>
              <ChakraProvider>
                <Stack direction="column" align="center">
                  <Button
                    data-testid="se-body-button-save-seach"
                    size="sm"
                    onClick={handleSaveSearch}
                    borderRadius={15}
                    leftIcon={<SaveOutlined htmlColor="#fff" fontSize="small" />}
                    colorScheme="blue"
                    isDisabled={!hasSomethingChanged}>
                    Save search
                  </Button>
                  <Button
                    onClick={handleClick}
                    size="lg"
                    width={150}
                    colorScheme="blue"
                    isDisabled={!hasSomethingChanged}
                    data-testid="se-body-button-search">
                    Search
                  </Button>
                </Stack>
              </ChakraProvider>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
