import React from 'react'
import { TextField } from '@shopify/polaris';
import AMPMPressed from './AMPMPressed'
import Placeholder from '../Placeholder'

export default function scheduleTime({ schedule, setSchedule, dateLabel }) {
    const inputLabel = {
        color: '#909090',
        fontSize: '14px'
    }
    return (
        <>

            <div style={{ width: '36%', marginRight: '20px' }}>
                <Placeholder
                    component={
                        <p style={inputLabel}>{dateLabel}</p>
                    }
                    marginTop='0'
                    padding='0'
                    height='auto'
                    width='auto'
                    marginBottom='5px'
                    itemsCentered={false}
                />
                <TextField
                    value={schedule.date}
                    onChange={(value) => { setSchedule((prev) => ({ ...prev, date: value })) }}
                    autoComplete="off"
                    type='date'
                />
            </div>

            <div style={{ marginRight: '20px' }}>
                <Placeholder
                    component={
                        <p style={inputLabel}>Time</p>
                    }
                    marginTop='0'
                    padding='0'
                    height='auto'
                    width='auto'
                    marginBottom='5px'
                    itemsCentered={false}
                />
                <TextField
                    value={schedule.time}
                    onChange={(value) => { setSchedule((prev) => ({ ...prev, time: value })) }}
                    autoComplete="off"
                    type='time'
                    
                />
            </div>
            {/* <div className='AmPmEle'>
                <Placeholder
                    component={
                        <p style={inputLabel}></p>
                    }
                    marginTop='0'
                    padding='0'
                    height='auto'
                    width='auto'
                    marginBottom='5px'
                    itemsCentered={false}
                />
                <AMPMPressed
                    setSchedule={setSchedule}
                    schedule={schedule}
                />
            </div> */}
        </>
    )
}
