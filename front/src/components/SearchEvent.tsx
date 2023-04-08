import React from 'react'
import { SearchIcon } from '@chakra-ui/icons'
import { Button, ChakraProvider, IconButton, Input, Stack, useOutsideClick } from '@chakra-ui/react'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import NumberSelector from './NumberSelector'
import InputDateRangePicker from './InputDateRangePicker'
import { SaveOutlined } from '@mui/icons-material'
import styles from '@styledComponentStyle/SearchEvent.module.css'
import InputSelectDropdown from './InputSelectDropdown'

export default function SearchEvent() {
  
  const ref = React.useRef(null)
  const [isDropdownOpen, setDropdownOpen] = React.useState(false)

  function handleDropdownOpen() {
    if (!isDropdownOpen) {
      setDropdownOpen(true)
    }
  }

  useOutsideClick({
    ref: ref,
    handler: () => setDropdownOpen(false),
  })

  return (
    <div ref={ref} className={styles.seContainer} data-testid="se-container">
      <div className={styles.seHeader} onClick={handleDropdownOpen}>
        <div className={styles.seHeaderGroup}>
          <ChakraProvider>
            <SearchIcon fontSize='x-large' data-testid="se-header-icon-search" />
            <Input
              variant="unstyled"
              placeholder="Where would you like to go?"
              data-testid="se-header-input"
            />
          </ChakraProvider>
        </div>
        <div className={styles.seHeaderGroup}>
          <IconButton aria-label='tune' onClick={() => setDropdownOpen(!isDropdownOpen)}>
            <TuneRoundedIcon />
          </IconButton>
        </div>
      </div>
      <div className={`${styles.seBody} ${isDropdownOpen ? styles.open : ""}`}>
        {isDropdownOpen ? (
          <>
            <InputSelectDropdown
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
            />
            <NumberSelector
              className={styles.seSelectNumberTraveler}
              title="Voyageur"
              items={[
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
              ]}
            />
            <InputDateRangePicker className={styles.seDatePicker} />
            <div className={styles.seBodyButtonAction}>
              <ChakraProvider>
                <Stack direction="column" align="center">
                  <Button
                    size="sm"
                    borderRadius={15}
                    leftIcon={<SaveOutlined htmlColor="#fff" fontSize="small" />}
                    colorScheme="blue"
                    isDisabled={true}>
                    Save search
                  </Button>
                  <Button size="lg" width={150} colorScheme="blue" isDisabled={true}>
                    Search
                  </Button>
                </Stack>
              </ChakraProvider>
            </div>
          </>
        ) : <></> }
      </div>
    </div>
  )
}
