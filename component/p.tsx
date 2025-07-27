export default async function P() {
    const d = await fetch("https://api.vercel.app/blog", { next: { revalidate: 3600 } });
    const ps = await d.json();
    return (
        <ul className="flex gap-5 flex-wrap">
            {ps.map((p:any) => 
                <li className="text-gray-700" key={p.id}>{p.title}</li>
            )}
        </ul>
  );
};