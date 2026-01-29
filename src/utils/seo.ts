export function seo({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return [
    {
      title,
    },
    {
      name: 'description',
      content: description,
    },
    {
      name: 'og:title',
      content: title,
    },
    {
      name: 'og:description',
      content: description,
    },
  ]
}
