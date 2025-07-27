// const Post = async () => {
//     const posts = await fetch('https://jsonplaceholder.typicode.com/posts');
//     const post = await posts.json()
//     return(
//         {post.map(p => {
//             <li>{post.id}</li>
//         })}
//     )
// };


// export default Post;

export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog', { next: { revalidate: 3600 } })
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post:any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}