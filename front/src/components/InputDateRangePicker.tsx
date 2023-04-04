import React from 'react'
import { Button, ChakraProvider } from '@chakra-ui/react'
import styles from './style/InputDateRangePicker.module.css'
import { ArrowForwardIcon, CalendarIcon, ChevronDownIcon } from '@chakra-ui/icons'
import EastIcon from '@mui/icons-material/East';
import { useAppSelector, useAppDispatch } from '../store/hook'
import moment from 'moment'
import { useOutsideClick } from '@chakra-ui/react';
import { DateCalendar } from '@mui/x-date-pickers'
import { addStartDate, addEndDate } from '../store/slices/dateSearchSlice';

export default function InputDateRangePicker() {
  const dateStore = useAppSelector(state => state.dateSearch)
  const dispatch = useAppDispatch()

  const ref = React.useRef(null)
  const [isDropdownOpen, setDropdownOpen] = React.useState(false)
  const [dateStart, setDateStart] = React.useState<moment.Moment | null>(dateStore.start !== null ? moment(dateStore.start) : dateStore.start)
  const [dateEnd, setDateEnd] = React.useState<moment.Moment | null>(dateStore.end !== null ? moment(dateStore.end) : dateStore.end)

  function dateHeaderDiplay(): JSX.Element {
    if (dateStore.isDateSet) {
      return (
        <>
          <p className={styles.idrpHeaderStartDate}>
            {moment(dateStore.start).format('DD/MM/yyyy')}
          </p>
          <ArrowForwardIcon />
          <p className={styles.idrpHeaderEndDate}>{moment(dateStore.end).format('DD/MM/yyyy')}</p>
        </>
      )
    }
    return <p className={styles.idrpHeaderChooseDate}>Choose date</p>
  }

  function handleDropdownOpen() {
    if (!isDropdownOpen) {
      setDropdownOpen(true)
    }
  }

  function handleCancel() {
    if (dateEnd !== null || dateStart !== null) {
      setDateStart(null);
      setDateEnd(null);
    } else {
      setDropdownOpen(false)
    }
  }

  function handleChangeDate() {
    if (dateStart!== null && dateEnd!== null) {
      dispatch(addStartDate(dateStart.toISOString()));
      dispatch(addEndDate(dateEnd.toISOString()));
      if (dateStore.isDateSet) {
        setDropdownOpen(false);
      }
    }
  }

  useOutsideClick({
    ref: ref,
    handler: () => setDropdownOpen(false),
  })

  return (
    <div className={styles.idrpContainer}>
      <div className={styles.idrpHeader} onClick={() => handleDropdownOpen()}>
        <div className={styles.idrpHeaderTitleContainer}>
          <h4 className={styles.idrpHeaderTitle}>Date</h4>
          <ChevronDownIcon />
        </div>
        <div className={`${styles.idrpHeaderDateContainer} ${dateStore.isDateSet ? styles.dateSet : ''}`}>
          {/* Add condition on display */}
          {dateHeaderDiplay()}
        </div>
        <span
          className={`${styles.idrpHeaderCalendarIcon} ${dateStore.isDateSet ? styles.dateSet : ''}`}>
          <CalendarIcon fontSize={dateStore.isDateSet ? 15 : 25} />
        </span>
      </div>
      <div ref={ref} className={`${styles.idrpBody} ${isDropdownOpen ? styles.activated : ""}`}>
        {isDropdownOpen ? (
          <>
            <div className={styles.idrpBodyHeader}>
              <div className={styles.idrpBodyHeaderDateDisplay}>
                <p className={styles.idrpBodyHeaderDateDisplayTitle}>Start date</p>
                <div className={styles.idrpBodyHeaderDateFormat}>
                  <span className={styles.idrpBodyHeaderDateFormatDayLetter}>{ dateStart ? dateStart.format("DD") : ""  } </span>
                  <span className={styles.idrpBodyHeaderDateFormatMonthYear}>{ dateStart ? dateStart.format("MMMM YYYY") : ""}</span>
                  <span className={styles.idrpBodyHeaderDateFormatDayName}>{ dateStart ? dateStart.format("dddd") : "" }</span>
                </div>
              </div>
              <EastIcon fontSize="large" color='primary' />
              <div className={styles.idrpBodyHeaderDateDisplay}>
                <p className={styles.idrpBodyHeaderDateDisplayTitle}>End date</p>
                <div className={styles.idrpBodyHeaderDateFormat}>
                <span className={styles.idrpBodyHeaderDateFormatDayLetter}>{ dateEnd ? dateEnd.format("DD") : ""  } </span>
                  <span className={styles.idrpBodyHeaderDateFormatMonthYear}>{ dateEnd ? dateEnd.format("MMMM YYYY") : ""}</span>
                  <span className={styles.idrpBodyHeaderDateFormatDayName}>{ dateEnd ? dateEnd.format("dddd") : "" }</span>
                </div>
              </div>
            </div>
            <div className={styles.idrpBodyCalendar}>
              <DateCalendar value={dateStart} onChange={(newValue) => setDateStart(newValue)} maxDate={dateEnd} />
              <DateCalendar value={dateEnd} onChange={(newValue) => setDateEnd(newValue)} minDate={dateStart} disabled={dateStart === null} disableHighlightToday={dateStart === null} />
            </div>
            <div className={styles.idrpBodyFooter}>
              <ChakraProvider>
                <Button variant="outline" colorScheme="gray" onClick={() => handleCancel()}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleChangeDate} isDisabled={!dateStart || !dateEnd}>Choose dates</Button>
              </ChakraProvider>
            </div>
          </>
        ) : <></>}
      </div>
    </div>
  )
}
