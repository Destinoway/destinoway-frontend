export const mapBlog = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    slug: blog.slug,
    description: blog.description,
    image: blog.featuredImage,

    categoryId: blog.categoryId,
    category: blog.categoryName || "Travel",

    date: blog.createdAt
      ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",

    author: blog.authorName || "Destonoway",
  };
};
