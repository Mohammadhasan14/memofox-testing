import React, { useEffect } from 'react'
import './messageCard.css'
import TimeAgo from '../TimeAgo';

export default function MessageCard({ data, handleOpenMessage, isItLast }) {


  return (
    <div className='card-parent'>
      <div className="card-sidebar">
        <div className='card-child'>
          <div className='tags-parent' onClick={handleOpenMessage}>
            {data && data?.selectedTags?.map((tag, index) => {
              return (
                <span className='tags'>{tag}</span>
              )
            })}
          </div>
          <div className="card-content">
            <div style={{ cursor: 'pointer' }} onClick={handleOpenMessage}>
              <div className='card-content-child1' >
                <div className='title-description-parent'>
                  <h2 className="card-title">{data?.campaignName}</h2>
                </div>
                <div className='image-div'>
                  <img src={`/apps/getmsg/uploads/${data?.storeURL}/${data?.selectedImage}`} alt="Card Image" className='card-image' />
                </div>
              </div>
              <div>
                <p className="card-description">{data?.previewSubject}</p>

              </div>
            </div>

            <div className='bottom-parent'>
              <p className='card-link' onClick={() => window.open(data?.externalURL,'_blank')}>{data?.ctaLabel}</p>
              <p className='message-card-time'>
                <TimeAgo timestamp={data?.createdAt} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
