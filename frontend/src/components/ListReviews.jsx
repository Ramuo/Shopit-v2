import React from 'react';
import default_avatar from '../images/default_avatar.jpg';
import StarRatings from 'react-star-ratings';

const ListReviews = ({reviews}) => {


    return (
        <div className="reviews w-75">
            <h3>Plus d'avis:</h3>
            <hr />
            {reviews?.map((review) => (
                <div key={review?._id} className="review-card my-3">
                    <div className="row">
                        <div className="col-1">
                            <img
                            src={review?.user?.avatar 
                                ? review?.user?.avatar?.url 
                                :  default_avatar
                                }
                            alt="Nom"
                            width="50"
                            height="50"
                            className="rounded-circle"
                            />
                        </div>
                        <div class="col-11">
                            <StarRatings
                            rating={review?.rating}
                            starRatedColor="#ffb829"
                            numberOfStars={5}
                            name="rating"
                            starDimension="24px"
                            starSpacing="1px"
                            />
                            <p class="review_user">{review.user?.name}</p>
                            <p class="review_comment">{review?.comment}</p>
                        </div>
                    </div>
                    <hr />
                </div>
            ))}
        </div>
    )
}

export default ListReviews