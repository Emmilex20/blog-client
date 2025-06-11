import { DiscussionEmbed } from 'disqus-react';

export default function Comments({ id, title }) {
  const url = window.location.href;
  return (
    <div className="my-8">
      <DiscussionEmbed
        shortname={import.meta.env.VITE_DISQUS_SHORTNAME}
        config={{ identifier: id, title, url }}
      />
    </div>
  );
}
