import Image from "next/image";
import type { SuccessStory } from "@/data/successStories";
import s from "./StoryDescription.module.css";

/**
 * A story's blurb. Plain text renders as is; a segmented description renders
 * each partner as its round mark followed by its name, inline with the text.
 */
export default function StoryDescription({
  description,
}: {
  description: SuccessStory["description"];
}) {
  if (typeof description === "string") return description;
  return (
    <>
      {description.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <span key={i} className={s.partner}>
            <Image src={part.mark} alt="" width={20} height={20} className={s.mark} />
            {part.name}
          </span>
        )
      )}
    </>
  );
}
