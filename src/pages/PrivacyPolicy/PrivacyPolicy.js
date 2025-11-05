import React, { useEffect } from "react";
import Header from "../../components/Header";
import { client } from "../../config/contentfulClient";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Footer from "../../components/Footer";

function PrivacyPolicy() {
  const [pages, setPages] = React.useState([]);

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

        console.log("====================================");
        console.log("PrivacyPolicy==>" + JSON.stringify);
        console.log("====================================");
        setPages(mapped);
      } catch (error) {
        console.error("❌ Error fetching pages:", error);
      }
    };

    fetchPages();
  }, []);

  const PageDetails = ({ page }) => {
    const { title, description } = page;

    return (
      <div className="page-container">
        {title && <h2>{title}</h2>}

        {description && (
          <div className="page-description">
            {documentToReactComponents(description)}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div class="page-wrapper " id="otherpage">
        <Header />
        <section class="first-sec-tb-space">
          <div class="container">
            {pages.map((page) => (
              <PageDetails key={page.id} page={page} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;
