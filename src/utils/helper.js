const slugify = (text) => {
  return text
    ?.toLowerCase()
    ?.trim()
    ?.replace(/\s+/g, "-") // spaces → dashes
    ?.replace(/[^\w\-]+/g, ""); // remove non-word characters except dashes
};

function formatPostedDate(isoDateString) {
  if (!isoDateString) return "";

  const date = new Date(isoDateString);

  if (isNaN(date.getTime())) return ""; // Invalid date

  const options = { year: "numeric", month: "long", day: "2-digit" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return `Posted on ${formattedDate}`;
}

const getDescription = (jsonData, maxLength = 400) => {
  return jsonData?.content
    ?.filter((item) => item.nodeType === "paragraph")
    ?.flatMap((item) => item.content || [])
    ?.filter((content) => content.nodeType === "text" && content.value)
    ?.map((content) => content.value.trim())
    ?.join(" ")
    ?.replace(/\s+/g, " ")
    ?.substring(0, maxLength)
    .trim();
};

export { slugify, formatPostedDate, getDescription };
