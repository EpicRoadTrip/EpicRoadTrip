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
import { useAppSelector } from 'src/store/hook'

export default function SearchEvent() {
  const ref = React.useRef(null)
  const refInputSearch = React.useRef(null)
  const dateStore = useAppSelector(state => state.dateSearch)
  const [inputSearchValue, setInputSearchValue] = React.useState<string>()
  const [isDropdownOpen, setDropdownOpen] = React.useState(false)
  const [selectedDataNumberSelector, setSelectedDataNumberSelector] = React.useState<
    INumberSelectorData[]
  >([
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
  >([])
  const isAllPropertiesRequiredPresent = () => {
    if (
      inputSearchValue &&
      inputSearchValue !== '' &&
      selectedDataNumberSelector.length !== 0 &&
      selectedDataNumberSelector.some(data => data.number !== 0) &&
      selectedDropdownData.length !== 0 &&
      dateStore.isDateSet
    ) {
      return true
    }
    return false
  }

  function handleDropdownOpen() {
    if (!isDropdownOpen) {
      ;(refInputSearch.current as unknown as HTMLInputElement).focus()
      setDropdownOpen(true)
    }
  }

  function handleClick() {
    // API Request
    console.log(isAllPropertiesRequiredPresent())
  }

  useOutsideClick({
    ref: ref,
    handler: () => setDropdownOpen(false),
  })

  return (
    <div ref={ref} className={styles.seContainer} data-testid="se-container">
      <div className={styles.seHeader} onClick={handleDropdownOpen} data-testid="se-header">
        <div className={styles.seHeaderGroup} data-testid="se-header-group-one">
          <ChakraProvider>
            <SearchIcon fontSize="x-large" data-testid="se-header-icon-search" />
            <Input
              ref={refInputSearch}
              value={inputSearchValue}
              onChange={event => setInputSearchValue(event.target.value)}
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
                  name: 'Transport',
                  apiName: 'transport',
                },
              ]}
              selectedData={selectedDropdownData}
              onSelectedChange={data => setSelectedDropdownData(data)}
            />
            <NumberSelector
              data-testid="se-body-number-selector"
              className={styles.seSelectNumberTraveler}
              title="Voyageur"
              items={selectedDataNumberSelector}
              onChange={data => setSelectedDataNumberSelector(data)}
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
                    borderRadius={15}
                    leftIcon={<SaveOutlined htmlColor="#fff" fontSize="small" />}
                    colorScheme="blue"
                    isDisabled={!isAllPropertiesRequiredPresent()}>
                    Save search
                  </Button>
                  <Button
                    onClick={handleClick}
                    size="lg"
                    width={150}
                    colorScheme="blue"
                    isDisabled={!isAllPropertiesRequiredPresent()}
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
