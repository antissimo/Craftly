interface Props {
  params: { name: string };
}

export default function PortfolioDetail({ params }: Props) {
  return (
    <section>
      <h1>Portfolio Detail: {params.name}</h1>
      <p>This is the public view of a single user's portfolio.</p>
    </section>
  );
}
