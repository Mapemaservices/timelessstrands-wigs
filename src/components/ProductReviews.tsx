import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, User, Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Review {
  id: number;
  userName: string;
  rating: number;
  date: string;
  review: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  size: string;
  color: string;
}

interface ProductReviewsProps {
  productId: number;
  rating: number;
  totalReviews: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, rating, totalReviews }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: 1,
      userName: "Sarah K.",
      rating: 5,
      date: "2024-01-15",
      review: "Absolutely love this wig! The quality is amazing and it looks so natural. The 13x4 lace frontal gives a perfect hairline and the curls are bouncy and soft. Worth every penny!",
      verified: true,
      helpful: 23,
      images: ["/placeholder.svg"],
      size: "16 inches",
      color: "Natural Black"
    },
    {
      id: 2,
      userName: "Grace M.",
      rating: 4,
      date: "2024-01-12",
      review: "Great wig overall. The color is vibrant and the hair feels soft. Only reason for 4 stars is that it took a bit of styling to get it perfect, but once styled it's gorgeous!",
      verified: true,
      helpful: 15,
      size: "18 inches",
      color: "Burgundy"
    },
    {
      id: 3,
      userName: "Mercy W.",
      rating: 5,
      date: "2024-01-10",
      review: "Second time buying from Timeless Strands and they never disappoint! Fast delivery, excellent customer service, and the wig quality is top-notch. Highly recommend!",
      verified: true,
      helpful: 31,
      size: "14 inches",
      color: "Natural Black"
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-gold fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const ratingDistribution = [
    { stars: 5, count: 180, percentage: 75 },
    { stars: 4, count: 40, percentage: 17 },
    { stars: 3, count: 15, percentage: 6 },
    { stars: 2, count: 3, percentage: 1 },
    { stars: 1, count: 2, percentage: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">{rating}</div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.floor(rating))}
            </div>
            <div className="text-muted-foreground">Based on {totalReviews} reviews</div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm">{stars}</span>
                  <Star className="w-3 h-3 text-gold fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gold h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <select 
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="border border-border rounded-lg px-3 py-1 text-sm"
          >
            <option value="all">All ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <SortAsc className="w-4 h-4" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-border rounded-lg px-3 py-1 text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
            <option value="helpful">Most helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full p-2">
                <User className="w-5 h-5" />
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{review.userName}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Size: {review.size}</Badge>
                  <Badge variant="outline">Color: {review.color}</Badge>
                </div>

                <p className="text-card-foreground leading-relaxed">{review.review}</p>

                {review.images && (
                  <div className="flex space-x-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-4 pt-3 border-t">
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-green-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-red-600 transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm">Not helpful</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <Button variant="outline" className="px-8">
          Load More Reviews
        </Button>
      </div>
    </div>
  );
};

export default ProductReviews;