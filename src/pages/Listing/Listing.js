import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { client } from "../../config/contentfulClient";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Link, useLocation } from "react-router-dom";
import { formatPostedDate, getDescription, slugify } from "../../utils/helper";

const Listing = () => {
  const [posts, setPosts] = useState([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [topArticles, setTopArticles] = useState([]);

  const limit = 10; // articles per page
  const location = useLocation();

  const apiName = location.state?.title;

useEffect(() => {
  const fetchPages = async () => {
    try {
      const response = await client.getEntries({
        content_type: "pagePrivacyPolicy", // 👈 replace this with your actual Content Type ID
      });

      console.log("✅ Pages:", response.items);

      const mapped = response.items.map((item) => ({
        id: item.sys.id,
        title: item.fields.title,
        description: item.fields.description,
        slug: item.fields.slug || "",
      }));

     } catch (error) {
      console.error("❌ Error fetching pages:", error);
    }
  };

  fetchPages();
}, []);



  useEffect(() => {
    const topQuery = {
      content_type: "article",
      order: "-sys.createdAt",
      limit: 3,
    };

    if (apiName && apiName !== "Body of Evidence") {
      topQuery["fields.blogType.sys.contentType.sys.id"] = "blog";
      topQuery["fields.blogType.fields.blogTitle"] = apiName;
    }

    client
      .getEntries(topQuery)
      .then((response) => {
        setTopArticles(response.items);
      })
      .catch((error) => {
        console.error("❌ Error fetching top articles:", error);
      });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const query = {
      content_type: "article",
      order: "-sys.createdAt",
      limit,
      skip: (currentPage - 1) * limit, // pagination skip
    };

    // ✅ Apply filter if apiName exists and not "Body of Evidence"
    if (apiName && apiName !== "Body of Evidence") {
      query["fields.blogType.sys.contentType.sys.id"] = "blog";
      query["fields.blogType.fields.blogTitle"] = apiName;
    }

    client
      .getEntries(query)
      .then((response) => {
        console.log("✅ Contentful Data:", response.items);
        setPosts(response.items);
        setTotalArticles(response.total); // total count from Contentful
      })
      .catch((error) => {
        console.error("❌ Error fetching from Contentful:", error);
      });
  }, [apiName, currentPage]);

  const { articleDescription, articleTitle, articleImage } =
    posts?.length > 0 && posts[0]?.fields;

  const { createdAt } = posts?.length > 0 && posts[0]?.sys;

  const imageUrl = articleImage?.fields?.file?.url
    ? `https:${articleImage.fields.file.url}`
    : null;

  const totalPages = Math.ceil(totalArticles / limit);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const slug = slugify(articleTitle);

  return (
    <div class="page-wrapper " id="otherpage">
      <Header />

      <section
        class="article-ltr-main first-sec-tb-space"
        id="article-ltr-main"
        style={{ minHeight: "calc(100vh - 50px)" }}
      >
        <div class="article-ltr-wp">
          <div class="article-ltr-wrap">
            <div class="container">
              <div class="row article-ltr-row justify-content-between">
                <div class="col-lg-7 article-ltr-left">
                  <div class="article-la-main">
                    <div class="article-la-wrap">
                      <div class="article-la-ttxt">
                        <h1>
                          {apiName &&
                            apiName !== "Body of Evidence" &&
                            "By " + apiName}{" "}
                          {apiName &&
                            apiName === "Body of Evidence" &&
                            "" + apiName}
                        </h1>
                        <p class="h5 fw-normal">
                          {/* {getDescription(articleDescription)} */}
                          The Bench Press is a mid-to-late phase Chest exercise
                          that is a staple in many gym-goers training programs
                          due to its considerably heavy load on the upper body.
                          It is a Horizontal Push exercise that challenges the
                          majority of upper body Muscle. When compared to more
                          vertical Push exercises such as the Overhead Press ,
                          the Bench Press has greater activation of the [[
                          Pectoralis Major ]] , although this is at the expense
                          of lower Upper [[ Trapezius ]] and Anterior [[ Deltoid
                          ]] activity (SOURCE-5).
                        </p>
                      </div>
                      {posts?.length == 0 && (
                          <section
                            class="search-article-main article-ltr-main"
                            id="search-article-main"
                            // style={{ height: "50px" }}
                          >
                                  
                            <div class="search-article-wp search-page-wp">
                                      
                              <div class="container">
                                          
                                <div class="search-page-content-height">
                                              <p>No articles found.</p>    
                                            
                                </div>
                                        
                              </div>
                                    
                            </div>
                                
                          </section>
                        )}
                      <div class="article-la-bn">
                        {currentPage === 1 && posts?.length > 0 && (
                          <>
                            <h2 class="h5 article-ltr-t">Latest Articles</h2>
                            {imageUrl ? (
                              <div class="article-la-bn-img-main">
                                <Link
                                  to={`/blog/${articleTitle}`}
                                  // state={{
                                  //   apiName: articleTitle,
                                  //   blobType: apiName,
                                  // }}
                                  className="article-title-d-link"
                                >
                                  <div class="article-la-bn-img-wrap">
                                    <div class="article-la-bn-img-inner">
                                      <img
                                        src={imageUrl}
                                        className="img-fluid w-100 h-100"
                                        alt="Image"
                                      />
                                    </div>
                                    <div class="article-la-bn-txt-wrap">
                                      <div class="article-title-date-main">
                                        <div class="article-title-date-wrap">
                                          <div class="article-title-d-wp">
                                            <h3 class="h4">{articleTitle}</h3>
                                            <div class="article-pdate">
                                              {formatPostedDate(createdAt)}
                                            </div>
                                          </div>
                                          <div class="article-title-d-arrow">
                                            <svg
                                              width="30"
                                              height="31"
                                              viewBox="0 0 30 31"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              {" "}
                                              <rect
                                                x="1"
                                                y="1.5"
                                                width="28"
                                                height="28"
                                                rx="14"
                                                stroke="white"
                                                stroke-width="2"
                                              />{" "}
                                              <g clip-path="url(#clip0_4001_211)">
                                                {" "}
                                                <path
                                                  d="M18.3758 10.0996H14.3258C13.9532 10.0996 13.6508 10.4016 13.6508 10.7746C13.6508 11.1477 13.9532 11.4496 14.3258 11.4496H18.0964L9.79836 19.7472C9.53466 20.0104 9.53466 20.4384 9.79836 20.7016C9.93021 20.8335 10.103 20.8992 10.2758 20.8992C10.4486 20.8992 10.6214 20.8335 10.7533 20.7016L19.0508 12.4041V16.1746C19.0508 16.5477 19.3532 16.8496 19.7258 16.8496C20.0984 16.8496 20.4008 16.5477 20.4008 16.1746V12.1246C20.4008 11.0082 19.4923 10.0996 18.3758 10.0996Z"
                                                  fill="#FFA51F"
                                                />{" "}
                                              </g>{" "}
                                              <defs>
                                                {" "}
                                                <clipPath id="clip0_4001_211">
                                                  {" "}
                                                  <rect
                                                    width="10.8"
                                                    height="10.8"
                                                    fill="white"
                                                    transform="translate(9.60059 10.0996)"
                                                  />{" "}
                                                </clipPath>{" "}
                                              </defs>{" "}
                                            </svg>
                                          </div>
                                        </div>
                                        <p class="article-title-date-txt">
                                          {getDescription(articleDescription)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            ) : (
                              <div class="col-md-12 article-col">
                                <div class="article-la-sbox">
                                  <div class="article-la-swrap">
                                    <Link
                                      to={`/blog/${articleTitle}`}
                                      // state={{
                                      //   apiName: articleTitle,
                                      //   blobType: apiName,
                                      // }}
                                      className="article-la-slink"
                                    >
                                      <div class="article-title-date-smain">
                                        <div class="article-title-date-wrap">
                                          <div class="article-title-d-wp">
                                            <h3 class="h4">{articleTitle}</h3>
                                            <div class="article-pdate">
                                              {formatPostedDate(createdAt)}
                                            </div>
                                          </div>
                                          <div class="article-title-d-arrow">
                                            <svg
                                              width="30"
                                              height="31"
                                              viewBox="0 0 30 31"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <rect
                                                x="1"
                                                y="1.5"
                                                width="28"
                                                height="28"
                                                rx="14"
                                                stroke="#FFA51F"
                                                strokeWidth="2"
                                              />
                                              <g clipPath="url(#clip0_4001_211)">
                                                <path
                                                  d="M18.3758 9.59961H14.3258C13.9532 9.59961 13.6508 9.90156 13.6508 10.2746C13.6508 10.6477 13.9532 10.9496 14.3258 10.9496H18.0964L9.79836 19.2472C9.53466 19.5104 9.53466 19.9384 9.79836 20.2016C9.93021 20.3335 10.103 20.3992 10.2758 20.3992C10.4486 20.3992 10.6214 20.3335 10.7533 20.2016L19.0508 11.9041V15.6746C19.0508 16.0477 19.3532 16.3496 19.7258 16.3496C20.0984 16.3496 20.4008 16.0477 20.4008 15.6746V11.6246C20.4008 10.5082 19.4923 9.59961 18.3758 9.59961Z"
                                                  fill="#FFA51F"
                                                />
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_4001_211">
                                                  <rect
                                                    width="10.8"
                                                    height="10.8"
                                                    fill="white"
                                                    transform="translate(9.60059 9.59961)"
                                                  />
                                                </clipPath>
                                              </defs>
                                            </svg>
                                          </div>
                                        </div>
                                        <p class="article-title-date-txt">
                                          {getDescription(articleDescription)}
                                        </p>
                                        {/* <p class="article-title-date-txt">{articleDescriptionText}</p> */}
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        

                        <div class="row article-row-main">
                          {posts.slice(1).map((post) => {
                            const {
                              articleTitle,
                              articleDescription,
                              articleImage,
                            } = post.fields;
                            const imageUrl = articleImage?.fields?.file?.url
                              ? `https:${articleImage.fields.file.url}`
                              : null;
                            const createdAt = post.sys.createdAt;

                            const slug = slugify(articleTitle);

                            // 🧩 Condition: Render layout based on image existence
                            if (imageUrl) {
                              return (
                                <div
                                  key={post.sys.id}
                                  class="col-md-12 article-col"
                                >
                                  <div class="article-la-sbox">
                                    <div class="article-la-swrap">
                                      <Link
                                        to={`/blog/${articleTitle}`}
                                        // state={{
                                        //   apiName: articleTitle,
                                        //   blobType: apiName,
                                        // }}
                                        className="article-la-slink article-la-llink"
                                      >
                                        <div class="article-title-date-smain article-title-date-lmain">
                                          <div class="article-la-lbox">
                                            <div class="row">
                                              <div class="col-md-4">
                                                <div class="article-la-l-img">
                                                  <img
                                                    src={imageUrl}
                                                    className="img-fluid"
                                                    alt={articleTitle}
                                                  />
                                                </div>
                                              </div>
                                              <div class="col-md-8">
                                                <div class="article-title-date-wrap">
                                                  <div class="article-title-d-wp">
                                                    <h3 class="h4">
                                                      {articleTitle}
                                                    </h3>
                                                    <div class="article-pdate">
                                                      {formatPostedDate(
                                                        createdAt
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div class="article-title-d-arrow">
                                                    <svg
                                                      width="30"
                                                      height="30"
                                                      viewBox="0 0 30 30"
                                                      fill="none"
                                                      xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                      <rect
                                                        x="1"
                                                        y="1"
                                                        width="28"
                                                        height="28"
                                                        rx="14"
                                                        stroke="#FFA51F"
                                                        strokeWidth="2"
                                                      />
                                                      <g clipPath="url(#clip0_4001_335)">
                                                        <path
                                                          d="M18.3758 9.59961H14.3258C13.9532 9.59961 13.6508 9.90156 13.6508 10.2746C13.6508 10.6477 13.9532 10.9496 14.3258 10.9496H18.0964L9.79836 19.2472C9.53466 19.5104 9.53466 19.9384 9.79836 20.2016C9.93021 20.3335 10.103 20.3992 10.2758 20.3992C10.4486 20.3992 10.6214 20.3335 10.7533 20.2016L19.0508 11.9041V15.6746C19.0508 16.0477 19.3532 16.3496 19.7258 16.3496C20.0984 16.3496 20.4008 16.0477 20.4008 15.6746V11.6246C20.4008 10.5082 19.4923 9.59961 18.3758 9.59961Z"
                                                          fill="#FFA51F"
                                                        />
                                                      </g>
                                                      <defs>
                                                        <clipPath id="clip0_4001_335">
                                                          <rect
                                                            width="10.8"
                                                            height="10.8"
                                                            fill="white"
                                                            transform="translate(9.60059 9.59961)"
                                                          />
                                                        </clipPath>
                                                      </defs>
                                                    </svg>
                                                  </div>
                                                </div>
                                                <p class="article-title-date-txt">
                                                  {getDescription(
                                                    articleDescription
                                                  )}
                                                </p>
                                                {/* <p class="article-title-date-txt">{articleDescriptionText}</p> */}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  key={post.sys.id}
                                  class="col-md-6 article-col"
                                >
                                  <div class="article-la-sbox">
                                    <div class="article-la-swrap">
                                      <Link
                                        to={`/blog/${articleTitle}`}
                                        // state={{
                                        //   apiName: articleTitle,
                                        //   blobType: apiName,
                                        // }}
                                        className="article-la-slink"
                                      >
                                        <div class="article-title-date-smain">
                                          <div class="article-title-date-wrap">
                                            <div class="article-title-d-wp">
                                              <h3 class="h4">{articleTitle}</h3>
                                              <div class="article-pdate">
                                                {formatPostedDate(createdAt)}
                                              </div>
                                            </div>
                                            <div class="article-title-d-arrow">
                                              <svg
                                                width="30"
                                                height="31"
                                                viewBox="0 0 30 31"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <rect
                                                  x="1"
                                                  y="1.5"
                                                  width="28"
                                                  height="28"
                                                  rx="14"
                                                  stroke="#FFA51F"
                                                  strokeWidth="2"
                                                />
                                                <g clipPath="url(#clip0_4001_211)">
                                                  <path
                                                    d="M18.3758 9.59961H14.3258C13.9532 9.59961 13.6508 9.90156 13.6508 10.2746C13.6508 10.6477 13.9532 10.9496 14.3258 10.9496H18.0964L9.79836 19.2472C9.53466 19.5104 9.53466 19.9384 9.79836 20.2016C9.93021 20.3335 10.103 20.3992 10.2758 20.3992C10.4486 20.3992 10.6214 20.3335 10.7533 20.2016L19.0508 11.9041V15.6746C19.0508 16.0477 19.3532 16.3496 19.7258 16.3496C20.0984 16.3496 20.4008 16.0477 20.4008 15.6746V11.6246C20.4008 10.5082 19.4923 9.59961 18.3758 9.59961Z"
                                                    fill="#FFA51F"
                                                  />
                                                </g>
                                                <defs>
                                                  <clipPath id="clip0_4001_211">
                                                    <rect
                                                      width="10.8"
                                                      height="10.8"
                                                      fill="white"
                                                      transform="translate(9.60059 9.59961)"
                                                    />
                                                  </clipPath>
                                                </defs>
                                              </svg>
                                            </div>
                                          </div>
                                          <p class="article-title-date-txt">
                                            {getDescription(articleDescription)}
                                          </p>
                                          {/* <p class="article-title-date-txt">{articleDescriptionText}</p> */}
                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {topArticles.length > 0 && (
                  <div class="col-lg-4 article-ltr-right">
                    <div class="article-ltr-tr-main">
                      <div class="article-ltr-tr-wrap">
                        <div class="article-ltr-topa-wrap">
                          <h2 class="h5 article-ltr-t">Top Articles</h2>
                          {topArticles.slice(0, 3).map((post) => {
                            const { articleTitle, articleDescription } =
                              post.fields;

                            const createdAt = post.sys.createdAt;
                            const slug = slugify(articleTitle);
                            return (
                              <div class="article-ltr-topa-box">
                                <Link
                                  to={`/blog/${articleTitle}`}
                                  // state={{
                                  //   apiName: articleTitle,
                                  //   blobType: apiName,
                                  // }}
                                  className="article-ltr-topa-box-link"
                                >
                                  <h4 class="h6">{articleTitle}</h4>
                                  <p class="article-title-date-txt">
                                    {getDescription(articleDescription)}
                                  </p>
                                </Link>
                                <div class="article-ltr-postd">
                                  <div>{formatPostedDate(createdAt)}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div class="article-ltr-retopic-wrap">
                          <div class="article-ltr-retopic-wp">
                            <h2 class="h5 article-ltr-t">Recommended topics</h2>
                            <ul class="list-unstyled brrt-point">
                              <li>
                                <Link
                                  to={`/blogs/region`}
                                  state={{ title: "Region" }}
                                  className="text-decoration-none"
                                >
                                  By region
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to={`/blogs/tissue`}
                                  state={{ title: "Tissue" }}
                                  className="text-decoration-none"
                                >
                                  By tissue
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to={`/blogs/movement`}
                                  state={{ title: "Movement" }}
                                  className="text-decoration-none"
                                >
                                  By movement
                                </Link>
                                {/* <a href="#">By movement</a> */}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {posts?.length > 0 && (
                <div class="pagination-wrap">
                  <nav aria-label="Page navigation">
                    <ul class="pagination">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button className="page-link" onClick={handlePrev}>
                          Previous
                        </button>
                      </li>

                      {Array.from({ length: totalPages }).map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}

                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button className="page-link" onClick={handleNext}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default Listing;
