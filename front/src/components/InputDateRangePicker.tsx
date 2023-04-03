import React from 'react'
import { Button, ChakraProvider } from '@chakra-ui/react'
import styles from './style/InputDateRangePicker.module.css'
import { ArrowForwardIcon, CalendarIcon, ChevronDownIcon } from '@chakra-ui/icons'
import EastIcon from '@mui/icons-material/East';
import { useAppSelector, useAppDispatch } from '../store/hook'
import moment from 'moment'
import { DateCalendar } from '@mui/x-date-pickers'
// import { addStartDate, addEndDate } from '../store/slices/dateSearchSlice';

export default function InputDateRangePicker() {
  const dateStore = useAppSelector(state => state.dateSearch)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useAppDispatch()

  function dateHeaderDiplay(): JSX.Element {
    if (dateStore.isDateSet) {
      return (
        <>
          <p className={styles.idrpHeaderStartDate}>
            {moment(dateStore.start).format('D/MM/yyyy')}
          </p>
          <ArrowForwardIcon />
          <p className={styles.idrpHeaderEndDate}>{moment(dateStore.end).format('D/MM/yyyy')}</p>
        </>
      )
    }
    return <p className={styles.idrpHeaderChooseDate}>Choose date</p>
  }

  return (
    <div className={styles.idrpContainer}>
      <div className={styles.idrpHeader}>
        <div className={styles.idrpHeaderTitleContainer}>
          <h3 className={styles.idrpHeaderTitle}>Date</h3>
          <ChevronDownIcon />
        </div>
        <div className={styles.idrpHeaderDateContainer}>
          {/* Add condition on display */}
          {dateHeaderDiplay()}
        </div>
        <span
          className={`${styles.idrpHeaderCalendarIcon} ${dateStore.isDateSet ? styles.dateSet : ''
            }`}>
          <CalendarIcon fontSize={dateStore.isDateSet ? 15 : 25} />
        </span>
      </div>
      <div className={styles.idrpBody}>
        <div className={styles.idrpBodyHeader}>
          <div className={styles.idrpBodyHeaderDateDisplay}>
            <p className={styles.idrpBodyHeaderDateDisplayTitle}>Start date</p>
            <div className={styles.idrpBodyHeaderDateFormat}>
              <span className={styles.idrpBodyHeaderDateFormatDayLetter}>12</span>
              <span className={styles.idrpBodyHeaderDateFormatMonthYear}>may 2023</span>
              <span className={styles.idrpBodyHeaderDateFormatDayName}>Friday</span>
            </div>
          </div>
          <EastIcon fontSize="large" color='primary' />
          <div className={styles.idrpBodyHeaderDateDisplay}>
            <p className={styles.idrpBodyHeaderDateDisplayTitle}>End date</p>
            <div className={styles.idrpBodyHeaderDateFormat}>
              <span className={styles.idrpBodyHeaderDateFormatDayLetter}>12</span>
              <span className={styles.idrpBodyHeaderDateFormatMonthYear}>may 2023</span>
              <span className={styles.idrpBodyHeaderDateFormatDayName}>Friday</span>
            </div>
          </div>
        </div>
        <div className={styles.idrpBodyCalendar}>
          <DateCalendar />
          <DateCalendar />
        </div>
        <div className={styles.idrpBodyFooter}>
          <ChakraProvider>
            <Button variant="outline" colorScheme="gray">
              Cancel
            </Button>
            <Button colorScheme="blue">Choose dates</Button>
          </ChakraProvider>
        </div>
      </div>
    </div>
  )
}
