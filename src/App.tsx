// 1. Describe what a review looks like
type Review = {
  id: number
  author: string
  rating: number
  text: string
  site: 'Google' | 'Yelp' | 'Facebook'
  postedAt: string
}

// 2. Some sample reviews that follow that description
const reviews: Review[] = [
  { id: 1, author: 'Wanjiru K.', rating: 5, text: 'Friendly staff and quick service.', site: 'Google', postedAt: '2026-10-01' },
  { id: 3, author: 'Brian O.', rating: 2, text: 'Waited 40 minutes for my order.', site: 'Yelp', postedAt: '2026-10-05' },
  { id: 2, author: 'Amina H.', rating: 4, text: 'Great food, a bit pricey.', site: 'Facebook', postedAt: '2026-10-12' },
]

// 3. The component: what shows on screen
function App() {
  return (
    <main>
      <h1>Repro Lab</h1>
      <p>Review dashboard</p>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <strong>{review.author}</strong> ({review.site}) {'⭐'.repeat(review.rating)}
            <p>{review.text}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App