"use strict";

// Assignment 6: small, readable jQuery features added to our existing EnglishLab.
$(document).ready(function () {
  console.log("jQuery is ready!");

  const $search = $("#siteSearch");
  const $suggestions = $("#siteSuggestions");
  const $searchStatus = $("#siteSearchStatus");
  const pages = [
    ["Dashboard", "index.html"], ["Tests", "tests.html"],
    ["Grammar Quiz", "quiz.html"], ["Learn", "learn.html"],
    ["Results", "results.html"], ["Contact", "contact.html"],
    ["Practice Lab", "practice-lab.html"],
    ["Grid Areas", "grid-layout.html"], ["Image Gallery", "gallery.html"],
    ["Grammar Basics", "tests.html"], ["Vocabulary Challenge", "tests.html"],
    ["Reading Practice", "tests.html"],
    ["Present Simple", "practice-lab.html#lesson-explorer"],
    ["Past Tense", "practice-lab.html#lesson-explorer"],
    ["Travel Words", "practice-lab.html#lesson-explorer"],
    ["Work Vocabulary", "practice-lab.html#lesson-explorer"],
    ["Reading for Gist", "practice-lab.html#lesson-explorer"],
    ["Reading for Detail", "practice-lab.html#lesson-explorer"],
    ["Daily Conversation", "practice-lab.html#lesson-explorer"],
    ["Fluent Answers", "practice-lab.html#lesson-explorer"]
  ];

  function clearHighlights() {
    $("mark.a6-match").each(function () {
      $(this).replaceWith(document.createTextNode($(this).text()));
    });
  }

  // Task 3: highlight matching text without deleting nested HTML or buttons.
  function highlightWords(keyword) {
    clearHighlights();
    if (!keyword) return;
    const main = document.querySelector("main");
    if (!main) return;
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim() && node.parentElement &&
          node.parentElement.closest("h1,h2,h3,p,li,figcaption,td") &&
          !node.parentElement.closest("a,button,script,style,mark,[hidden]")) {
        textNodes.push(node);
      }
    }
    textNodes.forEach(textNode => {
      const original = textNode.nodeValue;
      const lower = original.toLocaleLowerCase();
      const word = keyword.toLocaleLowerCase();
      if (!lower.includes(word)) return;
      const fragment = document.createDocumentFragment();
      let start = 0;
      let at = lower.indexOf(word);
      while (at !== -1) {
        fragment.append(document.createTextNode(original.slice(start, at)));
        const mark = document.createElement("mark");
        mark.className = "a6-match";
        mark.textContent = original.slice(at, at + word.length);
        fragment.append(mark);
        start = at + word.length;
        at = lower.indexOf(word, start);
      }
      fragment.append(document.createTextNode(original.slice(start)));
      textNode.replaceWith(fragment);
    });
  }

  // Tasks 1 and 2: filter page cards and suggest site pages as the user types.
  function applySearch() {
    const keyword = $search.val().trim().toLocaleLowerCase();
    const $items = $("[data-search-item]");
    let matches = 0;
    $items.each(function () {
      const text = ($(this).attr("data-search") || $(this).text()).toLocaleLowerCase();
      const visible = !keyword || text.includes(keyword);
      $(this).prop("hidden", !visible);
      if (visible) matches++;
    });
    if ($items.length) $searchStatus.text(keyword ? `${matches} of ${$items.length} items found` : "Search pages or lessons");
    else $searchStatus.text("Search pages or lessons");

    $suggestions.empty();
    if (keyword) {
      const found = pages.filter(page => page[0].toLocaleLowerCase().includes(keyword));
      found.slice(0, 5).forEach(page => {
        $("<a>", { href: page[1], class: "a6-suggestion", text: page[0] }).appendTo($suggestions);
      });
      if (!found.length) $("<span>", { class: "a6-suggestion-empty", text: "No matching page. Try a lesson name." }).appendTo($suggestions);
    }
    $suggestions.prop("hidden", !keyword);
    highlightWords(keyword);
  }
  $search.on("input", applySearch);
  $("#siteSearchClear").on("click", function () {
    $search.val("");
    applySearch();
    $search.trigger("focus");
  });
  $search.on("keydown", function (event) {
    if (event.key === "Escape") {
      $search.val(""); applySearch();
    }
    if (event.key === "ArrowDown") {
      const first = $suggestions.find("a").first();
      if (first.length) { event.preventDefault(); first.trigger("focus"); }
    }
    if (event.key === "Enter") {
      const first = $suggestions.find("a").first();
      if (first.length) { event.preventDefault(); window.location.href = first.attr("href"); }
    }
  });
  // Practice Lab creates lesson cards dynamically using vanilla JS.
  const lessonGrid = document.getElementById("a5LessonGrid");
  if (lessonGrid) {
    $(lessonGrid).find(".a5-lesson").attr("data-search-item", "");
    new MutationObserver(() => {
      $(lessonGrid).find(".a5-lesson").attr("data-search-item", "");
      if ($search.val().trim()) applySearch();
    }).observe(lessonGrid, { childList: true });
  }

  // Task 4: a thin progress bar at the top of every page.
  function updateScrollBar() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 100;
    $("#siteScrollFill").css("width", percent + "%");
  }
  $(window).on("scroll resize", updateScrollBar);
  updateScrollBar();

  // Task 5: animate existing statistics (no extra dashboard or complicated widgets).
  $(".a6-counter").each(function () {
    const element = this;
    const target = Number($(element).attr("data-target"));
    const suffix = $(element).attr("data-suffix") || "";
    if (!Number.isFinite(target)) return;
    $({ value: 0 }).animate({ value: target }, {
      duration: 1000,
      step: function (now) { element.textContent = Math.round(now) + suffix; },
      complete: function () { element.textContent = target + suffix; }
    });
  });

  // Task 7: notifications confirm actions and fade away automatically.
  function toast(message) {
    const $toast = $("#siteToast");
    $toast.stop(true, true).text(message).fadeIn(180).delay(1900).fadeOut(300);
  }
  document.addEventListener("englishlab:settings", event => {
    toast(`${event.detail.theme === "light" ? "Day" : "Night"} theme • Sound ${event.detail.soundEnabled ? "on" : "off"}`);
  });
  $(document).on("click", ".a5-star", () => toast("Rating saved for this session."));

  // Task 6: a spinner appears only after existing Assignment 4 validation passes.
  const forms = [
    ["#contactForm", "#contactFeedback"],
    ["#registerForm", "#registerFeedback"],
    ["#subscribeForm", "#subscribeFeedback"]
  ];
  forms.forEach(([formSelector, feedbackSelector]) => {
    $(formSelector).on("submit", function () {
      const feedback = document.querySelector(feedbackSelector);
      if (!feedback || feedback.dataset.state !== "success") return;
      const $button = $(this).find('button[type="submit"]').first();
      if (!$button.length || $button.prop("disabled")) return;
      const oldLabel = $button.html();
      $button.prop("disabled", true).html('<span class="a6-spinner" aria-hidden="true"></span> Please wait...');
      toast("Form validated. Demo only — nothing was sent.");
      window.setTimeout(() => $button.prop("disabled", false).html(oldLabel), 950);
    });
  });

  // Task 8: copy either a study phrase or the current page link.
  $("#siteCopyLink, [data-copy-target]").on("click", async function () {
    const $button = $(this);
    const original = $button.text();
    const target = $button.attr("data-copy-target");
    const link = target ? $(target).text().trim() : window.location.href;
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
        copied = true;
      } else {
        const field = document.createElement("textarea");
        field.value = link;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        copied = document.execCommand("copy");
        field.remove();
      }
    } catch (_) { copied = false; }
    $button.text(copied ? "✓ Copied!" : "Copy failed");
    $button.attr("title", copied ? "Copied to clipboard!" : "Copy is unavailable in this browser");
    toast(copied ? "Copied to clipboard." : "Clipboard unavailable. Please select and copy the text manually.");
    window.setTimeout(() => $button.text(original).removeAttr("title"), 1700);
  });

  // Task 9: image src is set only as each image approaches the viewport.
  function loadVisibleImages() {
    $("img[data-src]").each(function () {
      if (this.getBoundingClientRect().top < window.innerHeight + 350) {
        $(this).attr("src", $(this).attr("data-src")).removeAttr("data-src").addClass("a6-lazy-loaded");
      }
    });
  }
  $(window).on("scroll resize", loadVisibleImages);
  $(document).on("slid.bs.carousel", loadVisibleImages);
  loadVisibleImages();
});
