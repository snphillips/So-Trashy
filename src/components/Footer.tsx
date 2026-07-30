import React from "react";

export default function Footer() {
  return (
    <footer className="sidebar-footer" aria-label="Website footer">
      <p className="sidebar-link">
        <a href="https://sarahphillipsdev.netlify.app/" id="portfolio-link">
          by Sarah Phillips{" "}
          <i className="fa fa-external-link-square" aria-hidden="true"></i>
        </a>
      </p>
      <p className="sidebar-link">
        <a
          href="https://github.com/snphillips/So-Trashy-React"
          id="github-link"
        >
          Github <i className="fa fa-github" aria-hidden="true"></i>
        </a>
      </p>
    </footer>
  );
}
