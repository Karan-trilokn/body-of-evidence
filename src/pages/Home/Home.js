import React, { useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import $ from "jquery";
import "slick-carousel";

const Home = () => {


   useEffect(() => {
    // Reinitialize slider every time Home component is mounted
    setTimeout(() => {
      window.dispatchEvent(new Event("reInitSlider"));
    }, 50);
  }, []);
  useEffect(() => {

 
    const $slider = $(".vertical-slider");

    if ($slider.length && !$slider.hasClass("slick-initialized")) {
      $slider.slick({
        dots: true,
        arrows: false,
        autoplay: true,
        infinite: true,
        vertical: true,
        verticalSwiping: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        touchThreshold: 100,
        customPaging: () => '<span class="dot"></span>',
      });
    }

    return () => {
      // Cleanup: destroy slick when component unmounts
      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("unslick");
      }
    };
  }, []); // runs when Home component mounts

  return (
    <div className="page-wrapper" id="home">
      <Header />

      <section className="banner-wp" id="banner-wp">
        <div className="banner-main">
          <div className="banner-wrap">
            <div className="container">
              <div className="banner-container">
                <div className="banner-slider-wrap">
                  <div className="vertical-slider-stxt">B</div>
                  <div className="vertical-slider-wrap">
                    <div className="vertical-slider">
                      <div className="vertical-box-wrap">
                        <div className="vertical-box-wrap-inner">
                          <a className="text-decoration-none">
                            ody of Evidence
                          </a>
                          {/* <a href="/blogs/body-of-evidence" className="text-decoration-none">
                            
                          </a> */}
                        </div>
                      </div>
                      <div className="vertical-box-wrap">
                        <div className="vertical-box-wrap-inner">
                          <Link
                            to={`/blogs/region`}
                            state={{ title: "Region" }}
                            className="text-decoration-none"
                          >
                            y <span>region</span>
                          </Link>
                          {/* <a href="/blogs/region">y region</a> */}
                        </div>
                      </div>
                      <div className="vertical-box-wrap">
                        <div className="vertical-box-wrap-inner">
                          <Link
                            to={`/blogs/tissue`}
                            state={{ title: "Tissue" }}
                            className="text-decoration-none"
                          >
                            y <span>tissue</span>
                          </Link>
                          {/* <a href="/blogs/tissue">y tissue</a> */}
                        </div>
                      </div>
                      <div className="vertical-box-wrap">
                        <div className="vertical-box-wrap-inner">
                          <Link
                            to={`/blogs/movement`}
                            state={{ title: "Movement" }}
                            className="text-decoration-none"
                          >
                            y <span>movement</span>
                          </Link>
                          {/* <a href="/blogs/movement">y movement</a> */}
                        </div>
                      </div>
                      <div className="vertical-box-wrap">
                        <div className="vertical-box-wrap-inner">
                          <Link to="/search" state={{ focusSearch: true }}>
                            y <span>search</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="mouse-icon-wrap">
                      <img
                        src="assets/images/mouseb-icon.svg"
                        className="img-fluid mouseb-hs"
                        alt="Mouse"
                      />
                      <img
                        src="assets/images/mousew-icon.svg"
                        className="img-fluid mousew-hs"
                        alt="Mouse"
                      />
                    </div>
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

export default Home;
