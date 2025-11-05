import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { Link, useLocation, useParams } from "react-router-dom";
import { client } from "../../config/contentfulClient";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { formatPostedDate, getDescription, slugify } from "../../utils/helper";
import $ from "jquery";
import { useRef } from "react";
const Details = () => {
  const { name } = useParams();

  const [posts, setPosts] = useState([]);

  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);

  const blobType = location.state?.blobType;

  const [topArticles, setTopArticles] = useState([]);
  const [textCopied, setTextCopied] = useState(false);

const processedArticle = useRef(null);

  const originalContentRef = useRef(null);
const lastProcessedName = useRef(null);


   useEffect(() => {
    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(fa);

    return () => {
      document.head.removeChild(fa);
    };
  }, [])

  //Tops Articles Fetch
  useEffect(() => {
    const topQuery = {
      content_type: "article",
      order: "-sys.createdAt",
      limit: 3,
    };
    if (blobType && blobType !== "Body of Evidence") {
      topQuery["fields.blogType.sys.contentType.sys.id"] = "blog";
      topQuery["fields.blogType.fields.blogTitle"] = blobType;
    }

    if (name) {
      topQuery["fields.articleTitle[ne]"] = name;
    }

    client
      .getEntries(topQuery)
      .then((response) => {
        setTopArticles(response.items);
      })
      .catch((error) => {
        console.error("❌ Error fetching top articles:", error);
      });
  }, [blobType]);

  // Article Fetch
  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    
    // Reset processed flag when name changes
    lastProcessedName.current = null;

    client
      .getEntries({
        content_type: "article",
        "fields.articleTitle": name,
        limit: 1,
      })
      .then((response) => {
        setPosts(response.items);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [name]);

  const copyLink = () => {
    const link = `https://bodyofevidence.app.devlaunchpad.com.au/blog/${articleTitle}`;
    navigator.clipboard.writeText(link).then(
      () => {
        setTextCopied(true);
      },
      (err) => {
        console.error("❌ Could not copy text: ", err);
      }
    );
  };

  const { articleDescription, articleTitle, articleImage } =
    posts?.length > 0 && posts[0]?.fields;

  const { createdAt } = posts?.length > 0 && posts[0]?.sys;

  const imageUrl = articleImage?.fields?.file?.url
    ? `https:${articleImage.fields.file.url}`
    : null;
  const slug = slugify(articleTitle);
  const contentRef = useRef(null);

useEffect(() => {
  if (!contentRef.current || !articleDescription) return;

  // Only process if it's a new article
  if (lastProcessedName.current === name) return;

  const timer = setTimeout(() => {
    if (!contentRef.current) return;

    const $scope = $(contentRef.current);

    // Clean up any existing jQuery modifications
    $scope.find("h2").off("click").css("cursor", "");
    $scope.find('.toggle-icon').remove();
    
    $scope.find(".collapse-content").each(function() {
      const $wrapper = $(this);
      $wrapper.children().unwrap();
    });

    // Now apply fresh collapse functionality
    $scope.find("h2").each(function () {
      const $h2 = $(this);

      let $content = $();
      let $next = $h2.next();

      // Skip if already wrapped
      if ($next.hasClass("collapse-content")) return;

      while ($next.length && !$next.is("hr, h2")) {
        $content = $content.add($next);
        $next = $next.next();
      }

      if ($content.length) {
        const $wrapper = $('<div class="collapse-content"></div>');
        $h2.after($wrapper);
        $wrapper.append($content);
        $wrapper.hide();
      }

      // Add toggle icon
      $h2.append(' <i class="fa fa-plus toggle-icon" aria-hidden="true"></i>');

      $h2.css("cursor", "pointer").on("click", function () {
        const $content = $(this).next(".collapse-content");
        const $icon = $(this).find(".toggle-icon");

        if ($content.is(":visible")) {
          $content.stop(true, true).slideUp(400, "swing");
          $icon.removeClass("fa-minus").addClass("fa-plus");
        } else {
          $content.stop(true, true).slideDown(400, "swing");
          $icon.removeClass("fa-plus").addClass("fa-minus");
        }
      });
    });

    // Mark this article as processed
    lastProcessedName.current = name;
  }, 150);

  return () => {
    clearTimeout(timer);
  };
}, [posts, name]);

useEffect(() => {
  // Store original HTML on first render or when content changes
  if (contentRef.current && articleDescription && name !== processedArticle.current) {
    originalContentRef.current = contentRef.current.innerHTML;
    processedArticle.current = name;
  }
}, [articleDescription, name]);

  return (
    <div class="page-wrapper " id="otherpage">
      <Header />
      <section
        class="search-article-main article-ltr-main first-sec-tb-space no-article-found"
        id="search-article-main"
      >
        {isLoading && (
          <section className="search-article-main article-ltr-main">
            <div className="search-article-wp search-page-wp">
              <div className="container">
                <div
                  className="spinner-border text-warning"
                  role="status"
                  style={{
                    width: "3rem",
                    height: "3rem",
                  }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </section>
        )}
        {!isLoading && posts.length === 0 && (
          <section class="search-article-main article-ltr-main no-article-found">
            <div class="search-article-wp search-page-wp">
              <div class="container">
                <div class="row justify-content-center">
                  <div class="col-lg-8">
                    <div class="no-article-found-wrap text-center">
                      <div class="no-article-found-txt">
                        <h2 class="h4">No Article Found</h2>
                        <p>
                          We couldn't find any articles matching your search.
                          Please try different keywords.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {!isLoading && posts.length > 0 && (
          <section class="detail-screenbp-main" id="detail-screenbp-main">
            <div class="container">
              <div class="detail-screen-title-wrap">
                <div class="detail-screen-title-wp">
                  <div class="detail-screen-title-inn">
                    <h1 class="h2">{articleTitle}</h1>
                  </div>
                  <div class="detail-screen-sarticle-wrap">
                    <div class="detail-screen-sarticle-wp">
                      <button
                        type="button"
                        class="detail-screen-sarticle-link"
                        data-bs-toggle="modal"
                        data-bs-target="#sarticleModal"
                      >
                        <span class="detail-screen-sarticle-t">
                          Share Article
                        </span>
                        <span class="detail-screen-sarticle-icon">
                          <svg
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              width="30"
                              height="30"
                              rx="15"
                              fill="#41C1BA"
                            />
                            <path
                              d="M14.1559 10.1719C10.1932 11.3626 6.88677 12.3657 6.80552 12.4032C6.61801 12.4876 6.30237 12.7783 6.19611 12.9595C5.92735 13.4158 5.93047 14.0564 6.19924 14.5127C6.31174 14.7034 6.57425 14.9502 6.77114 15.0471C6.87114 15.1003 8.23058 15.5034 10.0244 16.0159L13.1027 16.8972L13.984 19.9755C14.5059 21.7975 14.8997 23.1288 14.9528 23.2319C15.0528 23.4288 15.3591 23.7413 15.5466 23.8382C16.0028 24.0694 16.6091 24.0538 17.0404 23.8038C17.2279 23.6944 17.4967 23.3944 17.5967 23.1881C17.6435 23.0944 18.6498 19.7724 19.8405 15.8097C21.4344 10.4906 22 8.56243 22 8.44992C22 8.16866 21.8187 7.99678 21.5312 8.00303C21.4 8.00615 19.6749 8.51243 14.1559 10.1719Z"
                              fill="white"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {imageUrl && (
                <div class="detail-screen-ban-wrap">
                  <img src={imageUrl} class="img-fluid" alt="Image" />
                </div>
              )}

              <div class="detail-screenb-main" ref={contentRef}>
                <div class="detail-screenb-wp">
                  <div class="detail-screenb-wrap">
                    {" "}
                    {articleDescription ? (
                      documentToReactComponents(articleDescription)
                    ) : (
                      <p>No description available</p>
                    )}
                  </div>
                </div>
              </div>
              <div class="detail-screen-art-end-share-article">
                <div class="detail-screen-sarticle-wrap">
                  <div class="detail-screen-sarticle-wp">
                    <button
                      type="button"
                      class="detail-screen-sarticle-link"
                      data-bs-toggle="modal"
                      data-bs-target="#sarticleModal"
                    >
                      <span class="detail-screen-sarticle-t">
                        Share Article
                      </span>
                      <span class="detail-screen-sarticle-icon">
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            width="30"
                            height="30"
                            rx="15"
                            fill="#41C1BA"
                          ></rect>
                          <path
                            d="M14.1559 10.1719C10.1932 11.3626 6.88677 12.3657 6.80552 12.4032C6.61801 12.4876 6.30237 12.7783 6.19611 12.9595C5.92735 13.4158 5.93047 14.0564 6.19924 14.5127C6.31174 14.7034 6.57425 14.9502 6.77114 15.0471C6.87114 15.1003 8.23058 15.5034 10.0244 16.0159L13.1027 16.8972L13.984 19.9755C14.5059 21.7975 14.8997 23.1288 14.9528 23.2319C15.0528 23.4288 15.3591 23.7413 15.5466 23.8382C16.0028 24.0694 16.6091 24.0538 17.0404 23.8038C17.2279 23.6944 17.4967 23.3944 17.5967 23.1881C17.6435 23.0944 18.6498 19.7724 19.8405 15.8097C21.4344 10.4906 22 8.56243 22 8.44992C22 8.16866 21.8187 7.99678 21.5312 8.00303C21.4 8.00615 19.6749 8.51243 14.1559 10.1719Z"
                            fill="white"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {topArticles.length > 0 && (
                <div class="detail-screen-latest-article-main">
                  <div class="detail-screen-latest-article-wrap">
                    <h2 class="h5 article-ltr-t">Related Articles</h2>
                    <div class="row justify-content-center">
                      {topArticles.map((post,index) => {
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

                        return (
                          <div class="col-md-6 col-lg-4" key={`article-${index}`}>
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
                                      {getDescription(articleDescription)}
                                    </p>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
        <div
          class="modal fade"
          id="sarticleModal"
          tabindex="-1"
          aria-labelledby="sarticleLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <div class="h4 modal-title" id="sarticleLabel">
                  share
                </div>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <h3 class="text-center">
                  Your article link is ready to share!
                </h3>
                <div class="modal-ashare-link-main">
                  <div class="modal-ashare-link-wrap">
                    <div class="modal-ashare-link">
                      <span>
                        {`https://bodyofevidence.app.devlaunchpad.com.au/blog/${articleTitle}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="ashare-copy"
                      onClick={copyLink}
                    >
                      {textCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Details;
