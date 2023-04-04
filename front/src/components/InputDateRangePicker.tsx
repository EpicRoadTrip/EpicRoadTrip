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
          <p className={styles.idrpHeaderStartDate} data-testid="idrp-header-start-date">
            {moment(dateStore.start).format('DD/MM/yyyy')}
          </p>
          <ArrowForwardIcon />
          <p className={styles.idrpHeaderEndDate} data-testid="idrp-header-end-date">{moment(dateStore.end).format('DD/MM/yyyy')}</p>
        </>
      )
    }
    return <p className={styles.idrpHeaderChooseDate} data-testid="idrp-header-choose-date">Choose date</p>
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
    <div className={styles.idrpContainer} data-testid="idrp-container">
      <div className={styles.idrpHeader} onClick={() => handleDropdownOpen()} data-testid="idrp-header">
        <div className={styles.idrpHeaderTitleContainer} data-testid="idrp-header-title-container">
          <h4 className={styles.idrpHeaderTitle} data-testid="idrp-header-title">Date</h4>
          <ChevronDownIcon />
        </div>
        <div className={`${styles.idrpHeaderDateContainer} ${dateStore.isDateSet ? styles.dateSet : ''}`} data-testid="idrp-header-date-container">
          {/* Add condition on display */}
          {dateHeaderDiplay()}
        </div>
        <span
          className={`${styles.idrpHeaderCalendarIcon} ${dateStore.isDateSet ? styles.dateSet : ''}`} data-testid="idrp-header-calendar-icon">
          <CalendarIcon fontSize={dateStore.isDateSet ? 15 : 25} />
        </span>
      </div>
      <div ref={ref} className={`${styles.idrpBody} ${isDropdownOpen ? styles.activated : ""}`} data-testid="idrp-body">
        {isDropdownOpen ? (
          <>
            <div className={styles.idrpBodyHeader} data-testid="idrp-body-header">
              <div className={styles.idrpBodyHeaderDateDisplay} data-testid="idrp-body-header-date-display">
                <p className={styles.idrpBodyHeaderDateDisplayTitle} data-testid="idrp-body-header-date-displayTitle">Start date</p>
                <div className={styles.idrpBodyHeaderDateFormat} data-testid="idrp-body-header-date-format">
                  <span className={styles.idrpBodyHeaderDateFormatDayLetter} data-testid="idrp-body-header-date-format-day-letter">{ dateStart ? dateStart.format("DD") : ""  } </span>
                  <span className={styles.idrpBodyHeaderDateFormatMonthYear} data-testid="idrp-body-header-date-format-month-year">{ dateStart ? dateStart.format("MMMM YYYY") : ""}</span>
                  <span className={styles.idrpBodyHeaderDateFormatDayName} data-testid="idrp-body-header-date-format-day-name">{ dateStart ? dateStart.format("dddd") : "" }</span>
                </div>
              </div>
              <EastIcon fontSize="large" color='primary' />
              <div className={styles.idrpBodyHeaderDateDisplay} data-testid="idrp-body-header-date-display">
                <p className={styles.idrpBodyHeaderDateDisplayTitle} data-testid="idrp-body-header-date-display-title">End date</p>
                <div className={styles.idrpBodyHeaderDateFormat} data-testid="idrp-body-header-date-format">
                <span className={styles.idrpBodyHeaderDateFormatDayLetter} data-testid="idrp-body-header-date-format-day-letter">{ dateEnd ? dateEnd.format("DD") : ""  } </span>
                  <span className={styles.idrpBodyHeaderDateFormatMonthYear} data-testid="idrp-body-header-date-format-month-year">{ dateEnd ? dateEnd.format("MMMM YYYY") : ""}</span>
                  <span className={styles.idrpBodyHeaderDateFormatDayName} data-testid="idrp-body-header-date-format-day-name">{ dateEnd ? dateEnd.format("dddd") : "" }</span>
                </div>
              </div>
            </div>
            <div className={styles.idrpBodyCalendar} data-testid="idrp-body-calendar">
              <DateCalendar value={dateStart} onChange={(newValue) => setDateStart(newValue)} maxDate={dateEnd} />
              <DateCalendar value={dateEnd} onChange={(newValue) => setDateEnd(newValue)} minDate={dateStart} disabled={dateStart === null} disableHighlightToday={dateStart === null} />
            </div>
            <div className={styles.idrpBodyFooter} data-testid="idrp-body-footer">
              <ChakraProvider>
                <Button variant="outline" colorScheme="gray" onClick={() => handleCancel()} data-testid='idrp-body-footer-button-cancel'>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleChangeDate} isDisabled={!dateStart || !dateEnd} data-testid='idrp-body-footer-button-select'>Choose dates</Button>
              </ChakraProvider>
            </div>
          </>
        ) : <></>}
      </div>
    </div>
  )
}
