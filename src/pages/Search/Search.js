import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatPostedDate, getDescription, slugify } from "../../utils/helper";
import { client } from "../../config/contentfulClient";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 10;
  const queryParam = new URLSearchParams(location.search);
  const searchTerm = queryParam.get("q") || "";

  useEffect(() => {
    if (!searchTerm) return;

    setIsLoading(true);
    window.scrollTo(0, 0);

    client
      .getEntries({
        content_type: "article",
        "fields.articleTitle[match]": searchTerm,
        order: "-sys.createdAt",
        limit,
        skip: (currentPage - 1) * limit,
      })
      .then((response) => {
        console.log("✅ Search Results:", response.items);
        setSearchResults(response.items);
        setTotalResults(response.total);
      })
      .catch((error) =>
        console.error("❌ Error fetching search results:", error)
      )
      .finally(() => setIsLoading(false));
  }, [searchTerm, currentPage]);

  const totalPages = Math.ceil(totalResults / limit);
  const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);

  return (
    <div className="page-wrapper" id="homedd">
      <Header />
       
 <section
   className={
   searchResults && searchResults.length !== 0
      ? "search-article-main article-ltr-main first-sec-tb-space"
      : "search-article-main article-ltr-main first-sec-tb-space no-article-found"
  }
           id="search-article-main"
        >
       {/* Loading Spinner */}
      {isLoading && (
        <section className="search-article-main article-ltr-main">
          <div className="search-article-wp search-page-wp">
            <div className="container">
               <div className="custom-spinner-container">
                 <div className="custom-spinner">
≈                <div className="spinner-border text-warning" role="status" style={{ 
                  width: '3rem', 
                  height: '3rem' 
                }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                </div>
             </div>
            </div>
          </div>
        </section>
      )}
      {searchResults.length === 0 && !isLoading ? (
        // <section
        //   class="search-article-main article-ltr-main"
        //   id="search-article-main"
        // >
        //         
        //   <div class="search-article-wp search-page-wp">
        //             
        //     <div class="container">
        //                 
        //       <div class="search-page-content-height">
        //                     <p>No articles found.</p>               
        //       </div>
        //               
        //     </div>
        //           
        //   </div>
        //       
        // </section>
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
      ) : !isLoading && (
        <section
          class="search-article-main article-ltr-main"
          id="search-article-main"
        >
          <div class="search-article-wp">
            <div class="search-article-wrap">
              <div class="container">
                <div class="row">
                  <div class="search-article-la-main">
                    <div class="search-article-la-wrap">
                      <div class="article-la-ttxt search-article-stxt">
                        <h1>
                          Search Results:{" "}
                          <span class="search-article-nametxt">
                            {searchTerm}
                          </span>
                        </h1>
                      </div>
                      <div class="article-la-bn">
                        <div class="row">
                          {searchResults.map((post) => {
                            const {
                              articleTitle,
                              articleDescription,
                              articleImage,
                            } = post.fields;

                            console.log("article==>" + articleTitle);

                            const imageUrl = articleImage?.fields?.file?.url
                              ? `https:${articleImage.fields.file.url}`
                              : null;
                            const createdAt = post.sys.createdAt;

                            const slug = slugify(articleTitle);
                            return (
                              <div class="col-md-6 col-lg-4" key={post.sys.id}>
                                <div class="article-la-sbox">
                                  <div class="article-la-swrap">
                                    <Link
                                      to={`/blog/${articleTitle}`}
                                      // state={{ apiName: articleTitle }}
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
                                                stroke-width="2"
                                              />
                                              <g clip-path="url(#clip0_4001_335)">
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
                          {/* <div class="col-md-6 col-lg-4">
                          <div class="article-la-sbox">
                            <div class="article-la-swrap">
                              <a href="#" class="article-la-slink">
                                <div class="article-title-date-smain">
                                  <div class="article-title-date-wrap">
                                    <div class="article-title-d-wp">
                                      <h3 class="h4">Scapular Dyskinesis</h3>
                                      <div class="article-pdate">
                                        Posted on June 15, 2025
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
                                          stroke-width="2"
                                        />
                                        <g clip-path="url(#clip0_4001_335)">
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
                                    Scapula Dyskinesis is an umbrella term for
                                    conditions that alter Scapula kinematics and
                                    has been described as a non-specific
                                    response to Pain experienced in The Shoulder
                                    Girdle region (SOURCE-1). While several
                                    attempts have been made to distinguish
                                    distinct types of Scapular Dyskinesis, it is
                                    generally present as one or a combination of
                                    [[ Scapular Winging ]] and [[ Scapular
                                    Tilting ]] .
                                  </p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="article-la-sbox">
                            <div class="article-la-swrap">
                              <a href="#" class="article-la-slink">
                                <div class="article-title-date-smain">
                                  <div class="article-title-date-wrap">
                                    <div class="article-title-d-wp">
                                      <h3 class="h4">The Shoulder Girdle</h3>
                                      <div class="article-pdate">
                                        Posted on June 20, 2025
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
                                          stroke-width="2"
                                        />
                                        <g clip-path="url(#clip0_4001_335)">
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
                                    The Shoulder Girdle is comprised of 3 joints
                                    and 2 functional articulations, with only
                                    one point of direct contact with the axial
                                    skeleton. It’s ball-and-socket construction
                                    facilitates maximum range of motion in all
                                    three planes of movement making it the most
                                    mobile joint in the body (SOURCE-7);
                                    however, this is at the expense of its
                                    stability. Muscles of the shoulder complex
                                    provide the dynamic stability the joints
                                    themselves lack.
                                  </p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="article-la-sbox">
                            <div class="article-la-swrap">
                              <a href="#" class="article-la-slink">
                                <div class="article-title-date-smain">
                                  <div class="article-title-date-wrap">
                                    <div class="article-title-d-wp">
                                      <h3 class="h4">Bench Press</h3>
                                      <div class="article-pdate">
                                        Posted on June 22, 2025
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
                                          stroke-width="2"
                                        />
                                        <g clip-path="url(#clip0_4001_335)">
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
                                    The Bench Press is a mid-to-late phase Chest
                                    exercise that is a staple in many gym-goers
                                    training programs due to its considerably
                                    heavy load on the upper body. It is a
                                    Horizontal Push exercise that challenges the
                                    majority of upper body Muscle. When compared
                                    to more vertical Push exercises such as the
                                    Overhead Press , the Bench Press has greater
                                    activation of the [[ Pectoralis Major ]] ,
                                    although this is at the expense of lower
                                    Upper [[ Trapezius ]] and Anterior [[
                                    Deltoid ]] activity (SOURCE-5).
                                  </p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="article-la-sbox">
                            <div class="article-la-swrap">
                              <a href="#" class="article-la-slink">
                                <div class="article-title-date-smain">
                                  <div class="article-title-date-wrap">
                                    <div class="article-title-d-wp">
                                      <h3 class="h4">Bench Press</h3>
                                      <div class="article-pdate">
                                        Posted on June 10, 2025
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
                                          stroke-width="2"
                                        />
                                        <g clip-path="url(#clip0_4001_335)">
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
                                    The Bench Press is a mid-to-late phase Chest
                                    exercise that is a staple in many gym-goers
                                    training programs due to its considerably
                                    heavy load on the upper body. It is a
                                    Horizontal Push exercise that challenges the
                                    majority of upper body Muscle. When compared
                                    to more vertical Push exercises such as the
                                    Overhead Press , the Bench Press has greater
                                    activation of the [[ Pectoralis Major ]] ,
                                    although this is at the expense of lower
                                    Upper [[ Trapezius ]] and Anterior [[
                                    Deltoid ]] activity (SOURCE-5).
                                  </p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="article-la-sbox">
                            <div class="article-la-swrap">
                              <a href="#" class="article-la-slink">
                                <div class="article-title-date-smain">
                                  <div class="article-title-date-wrap">
                                    <div class="article-title-d-wp">
                                      <h3 class="h4">Scapular Dyskinesis</h3>
                                      <div class="article-pdate">
                                        Posted on June 15, 2025
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
                                          stroke-width="2"
                                        />
                                        <g clip-path="url(#clip0_4001_335)">
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
                                    Scapula Dyskinesis is an umbrella term for
                                    conditions that alter Scapula kinematics and
                                    has been described as a non-specific
                                    response to Pain experienced in The Shoulder
                                    Girdle region (SOURCE-1). While several
                                    attempts have been made to distinguish
                                    distinct types of Scapular Dyskinesis, it is
                                    generally present as one or a combination of
                                    [[ Scapular Winging ]] and [[ Scapular
                                    Tilting ]] .
                                  </p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="article-la-sbox">
                            <div class="article-la-swrap">
                              <a href="#" class="article-la-slink">
                                <div class="article-title-date-smain">
                                  <div class="article-title-date-wrap">
                                    <div class="article-title-d-wp">
                                      <h3 class="h4">The Shoulder Girdle</h3>
                                      <div class="article-pdate">
                                        Posted on June 20, 2025
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
                                          stroke-width="2"
                                        />
                                        <g clip-path="url(#clip0_4001_335)">
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
                                    The Shoulder Girdle is comprised of 3 joints
                                    and 2 functional articulations, with only
                                    one point of direct contact with the axial
                                    skeleton. It’s ball-and-socket construction
                                    facilitates maximum range of motion in all
                                    three planes of movement making it the most
                                    mobile joint in the body (SOURCE-7);
                                    however, this is at the expense of its
                                    stability. Muscles of the shoulder complex
                                    provide the dynamic stability the joints
                                    themselves lack.
                                  </p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="article-la-sbox">
                            <div class="article-la-swrap">
                              <a href="#" class="article-la-slink">
                                <div class="article-title-date-smain">
                                  <div class="article-title-date-wrap">
                                    <div class="article-title-d-wp">
                                      <h3 class="h4">Bench Press</h3>
                                      <div class="article-pdate">
                                        Posted on June 22, 2025
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
                                          stroke-width="2"
                                        />
                                        <g clip-path="url(#clip0_4001_335)">
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
                                    The Bench Press is a mid-to-late phase Chest
                                    exercise that is a staple in many gym-goers
                                    training programs due to its considerably
                                    heavy load on the upper body. It is a
                                    Horizontal Push exercise that challenges the
                                    majority of upper body Muscle. When compared
                                    to more vertical Push exercises such as the
                                    Overhead Press , the Bench Press has greater
                                    activation of the [[ Pectoralis Major ]] ,
                                    although this is at the expense of lower
                                    Upper [[ Trapezius ]] and Anterior [[
                                    Deltoid ]] activity (SOURCE-5).
                                  </p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <li
                          key={i}
                          className={`page-item ${
                            currentPage === i + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
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
              </div>
            </div>
          </div>
        </section>
      )}
      </section>
      <Footer />
    </div>
  );
};

export default Search;
