import React from 'react'
import TimeAgo from '../TimeAgo'
import './MessageDetailsCard.css'

export default function MessageDetailsCard({ data }) {
    return (
        <div className='card-parent'>
            <div className="card-sidebar">
                <div className='card-child'>
                    <div className='tags-parent' >
                        {data && data?.selectedTags?.map((tag, index) => {
                            return (
                                <span className='tags'>{tag}</span>
                            )
                        })}
                    </div>
                    <div className="card-content">
                        <div className='title-description-parent'>
                            <h2 className="details-card-title">{data?.campaignName}</h2>
                            <p className='card-time'>
                                <TimeAgo timestamp={data?.createdAt} />
                            </p>
                        </div>
                        <div className='details-image-div'>
                            <img src={`/apps/getmsg/uploads/${data?.storeURL}/${data?.selectedImage}`} alt="Card Image" className='details-card-image' />
                        </div>
                        <div className='messageDetails' dangerouslySetInnerHTML={{ __html: data?.previewText }} />
                        <div className='bottom-parent'>
                            <p className='card-link' onClick={() => window.open(data?.externalURL,'_blank') }>{data?.ctaLabel}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
