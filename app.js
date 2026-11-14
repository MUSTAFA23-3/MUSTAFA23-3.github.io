document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Drawer
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
      mobileToggle.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.hidden = expanded;
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
      });
    });
  }

  // 2. Scroll-Reveal Animations (IntersectionObserver)
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // 3. Interactive Project Category Filters
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      projectCards.forEach((card) => {
        const cat = card.dataset.category;
        card.hidden = !(filter === "all" || cat === filter);
      });
    });
  });

  // 4. Interactive Case Study Modal
  const CASE_STUDIES = {
    p1: {
      category: "LANDING PAGE ARCHITECTURE",
      title: "SwiftRoute Logistics — B2B Conversion Landing Page",
      problem: "B2B logistics buyers frequently abandon legacy freight websites that require filling out long forms and waiting 24–48 hours for a manual quote.",
      solution: "Designed and engineered a strict Light-Mode landing page featuring an instant JavaScript quote estimator (corridor rates, 1–500 kg weight slider, 3 service tier multipliers, and optional cargo protection) that pre-fills the validated dispatch inquiry form in one click.",
      impact: "Verified 0 console/runtime errors across 1440px desktop and 390px mobile viewports, delivering instant pricing transparency and a frictionless lead capture funnel.",
      repo: "https://github.com/MUSTAFA23-3/conversion-landing-page",
      demo: "https://mustafa23-3.github.io/conversion-landing-page/"
    },
    p2: {
      category: "GOOGLE SHEETS & APPS SCRIPT",
      title: "Automated CRM & Inventory Management Suite",
      problem: "Growing operations teams lose revenue when order spreadsheets are disconnected from inventory counts, causing overselling, duplicate CRM leads, and missed restock windows.",
      solution: "Built a multi-tab Excel/Sheets template powered by live SUMIFS, COUNTIFS, and IF formulas alongside a production Google Apps Script (Code.gs) with custom menu actions, automated stock deduction, composite-key deduplication, and Light-Mode HTML low-stock email alerts.",
      impact: "Eliminates manual stock reconciliation errors and provides real-time pipeline KPIs and instant reorder notifications.",
      repo: "https://github.com/MUSTAFA23-3/google-sheets-apps-script-crm",
      demo: ""
    },
    p3: {
      category: "WORKFLOW & PDF AUTOMATION",
      title: "Automated Lead-to-Proposal & PDF Invoice Engine",
      problem: "Agencies and service providers spend hours copying client details into document templates, introducing pricing typos and slowing down deal velocity.",
      solution: "Engineered a dual-mode automation bridge: apps_script_pdf_mailer.gs converts Google Sheet/Form submissions into branded PDF proposals, archives them in Google Drive, and emails clients automatically; local_pdf_generator.py batch-generates ReportLab PDFs from CSV data.",
      impact: "Reduces proposal turnaround from 30+ minutes to under 10 seconds with a clean, auditable Google Drive archive.",
      repo: "https://github.com/MUSTAFA23-3/automated-pdf-proposal-engine",
      demo: ""
    }
  };

  const modal = document.getElementById("caseStudyModal");
  const modalCategory = document.getElementById("modalCategory");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalFooter = document.getElementById("modalFooter");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  document.querySelectorAll(".case-study-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const data = CASE_STUDIES[btn.dataset.project];
      if (!data) return;

      modalCategory.textContent = data.category;
      modalTitle.textContent = data.title;
      modalBody.innerHTML = `
        <p><strong>Business Problem:</strong> ${data.problem}</p>
        <p><strong>Engineering Solution:</strong> ${data.solution}</p>
        <p><strong>Measurable Impact:</strong> ${data.impact}</p>
      `;

      let footerHtml = `<a href="${data.repo}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">View Source on GitHub</a>`;
      if (data.demo) {
        footerHtml += `<a href="${data.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Open Live Demo</a>`;
      }
      modalFooter.innerHTML = footerHtml;
      modal.hidden = false;
    });
  });

  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener("click", () => {
      modal.hidden = true;
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.hidden = true;
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) modal.hidden = true;
    });
  }

  // 5. One-Click Copy Email + Toast
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2800);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = copyEmailBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Copied: ${email}`);
      } catch {
        showToast(`Email: ${email}`);
      }
    });
  }

  // 6. Client Inquiry Form (WhatsApp & Mailto Generator)
  const inquiryForm = document.getElementById("inquiryForm");
  const clientName = document.getElementById("clientName");
  const serviceType = document.getElementById("serviceType");
  const projectBrief = document.getElementById("projectBrief");
  const errClientName = document.getElementById("errClientName");
  const errProjectBrief = document.getElementById("errProjectBrief");
  const sendEmailBtn = document.getElementById("sendEmailBtn");

  function validateInquiry() {
    let ok = true;
    errClientName.textContent = "";
    errProjectBrief.textContent = "";

    if (clientName.value.trim().length < 2) {
      errClientName.textContent = "Please enter your name.";
      ok = false;
    }
    if (projectBrief.value.trim().length < 8) {
      errProjectBrief.textContent = "Please add a brief project description.";
      ok = false;
    }
    return ok;
  }

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateInquiry()) return;

      const msg = `Hi Mustafa, my name is ${clientName.value.trim()}.\nProject Type: ${serviceType.value}\nBrief: ${projectBrief.value.trim()}`;
      const waUrl = `https://wa.me/201001809230?text=${encodeURIComponent(msg)}`;
      showToast("Opening WhatsApp with your project brief...");
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  if (sendEmailBtn) {
    sendEmailBtn.addEventListener("click", () => {
      if (!validateInquiry()) return;
      const subject = `Project Inquiry: ${serviceType.value} — ${clientName.value.trim()}`;
      const body = `Hi Mustafa,\n\nName: ${clientName.value.trim()}\nService: ${serviceType.value}\n\nProject Brief:\n${projectBrief.value.trim()}`;
      window.location.href = `mailto:01148766696m@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
});
