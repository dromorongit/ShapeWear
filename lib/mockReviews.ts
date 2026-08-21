export interface MockReview {
  id: string
  productId: string
  reviewerName: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
  status: 'approved' | 'pending'
  createdAt: string
}

export const mockReviews: MockReview[] = [
  {
    id: '1',
    productId: '1',
    reviewerName: 'Ama K.',
    rating: 5,
    comment: 'Wore these under a fitted dress for a wedding and forgot I had them on. Smoothing is incredible and no rolling at all.',
    status: 'approved',
    createdAt: '2026-07-12',
  },
  {
    id: '2',
    productId: '1',
    reviewerName: 'Efua M.',
    rating: 4,
    comment: 'Very comfortable for all-day wear. Would love if the XL was back in stock - ran out fast!',
    status: 'approved',
    createdAt: '2026-06-28',
  },
  {
    id: '3',
    productId: '2',
    reviewerName: 'Nana A.',
    rating: 5,
    comment: 'The adjustable straps make all the difference. Finally a bodysuit that stays in place without digging in.',
    status: 'approved',
    createdAt: '2026-08-01',
  },
  {
    id: '4',
    productId: '5',
    reviewerName: 'Kukua B.',
    rating: 4,
    comment: 'Good tummy control and the thong back actually works - no lines under my bodycon dresses. Wish it came in more colors.',
    status: 'approved',
    createdAt: '2026-07-19',
  },
  {
    id: '5',
    productId: '3',
    reviewerName: 'Akua O.',
    rating: 5,
    comment: 'The back support is real. Wore it on a 10-hour flight and felt so much more secure. Already ordered a second one.',
    status: 'approved',
    createdAt: '2026-08-05',
  },
  {
    id: '6',
    productId: '6',
    reviewerName: 'Mansa D.',
    rating: 5,
    comment: 'Authentic faja feel with the quality you expect. Compression is strong but the cotton lining keeps it breathable.',
    status: 'approved',
    createdAt: '2026-07-30',
  },
]
