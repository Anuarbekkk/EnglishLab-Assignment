"use strict";

// Lightweight jQuery enhancements: current-page search, animation, feedback and image loading.
$(document).ready(function () {
  console.log("jQuery is ready!");

  // Find text inside the CURRENT page. No navbar search, and no cards disappear.
  // jQuery live search / autocomplete / highlighting, with keyboard navigation.
  const $search = $("#siteSearch");
  const $suggestions = $("#siteSuggestions");
  const $searchStatus = $("#siteSearchStatus");
  const $copyResults = $("#siteCopyResults");
  const $previous = $("#siteMatchPrevious");
  const $next = $("#siteMatchNext");
  const main = document.querySelector("#main-content") || document.querySelector("main");
  let foundMarks = [];
  let activeIndex = -1;

  function clearHighlights() {
    const changedParents = new Set();
    if (!main) return;
    main.querySelectorAll("mark.a6-match").forEach(mark => {
      const parent = mark.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      changedParents.add(parent);
    });
    changedParents.forEach(parent => parent.normalize());
    foundMarks = [];
    activeIndex = -1;
  }

  function searchableNode(node) {
    const parent = node.parentElement;
    if (!parent || !node.nodeValue.trim() || !parent.getClientRects().length) return false;
    if (parent.closest('script,style,noscript,svg,textarea,option,select,[hidden],[aria-hidden="true"],[inert],.a6-no-search,.a6-suggestions')) return false;
    // The text has to be visible in this page, not in a collapsed FAQ/carousel.
    const hiddenAncestor = parent.closest('.carousel-item:not(.active),.faq-answer:not([aria-hidden="false"])');
    return !hiddenAncestor;
  }

  function highlightPage(query) {
    clearHighlights();
    if (!main || !query) return;
    const textNodes = [];
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode: node => searchableNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);
    const lowerQuery = query.toLocaleLowerCase();
    textNodes.forEach(textNode => {
      const original = textNode.nodeValue;
      const lower = original.toLocaleLowerCase();
      if (!lower.includes(lowerQuery)) return;
      const fragment = document.createDocumentFragment();
      let from = 0, at = lower.indexOf(lowerQuery);
      while (at !== -1) {
        fragment.appendChild(document.createTextNode(original.slice(from, at)));
        const mark = document.createElement('mark');
        mark.className = 'a6-match';
        mark.textContent = original.slice(at, at + query.length);
        fragment.appendChild(mark);
        foundMarks.push(mark);
        from = at + query.length;
        at = lower.indexOf(lowerQuery, from);
      }
      fragment.appendChild(document.createTextNode(original.slice(from)));
      textNode.replaceWith(fragment);
    });
  }

  function matchExcerpt(mark) {
    const container = mark.closest('h1,h2,h3,h4,p,li,td,th,figcaption,label,button,a,legend,.a5-lesson') || mark.parentElement;
    return (container?.textContent || mark.textContent).replace(/\s+/g, ' ').trim().slice(0, 170);
  }

  function setActiveMatch(index, shouldScroll) {
    if (!foundMarks.length) return;
    if (activeIndex >= 0) foundMarks[activeIndex]?.classList.remove('a6-match-current');
    activeIndex = (index + foundMarks.length) % foundMarks.length;
    const mark = foundMarks[activeIndex];
    mark.classList.add('a6-match-current');
    $searchStatus.text(`Match ${activeIndex + 1} of ${foundMarks.length} on this page · Enter for next`);
    if (shouldScroll) mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function renderLocalSuggestions(query) {
    $suggestions.empty();
    if (!query || !foundMarks.length) { $suggestions.prop('hidden', true); return; }
    const seen = new Set();
    foundMarks.forEach((mark, index) => {
      const excerpt = matchExcerpt(mark);
      if (!excerpt || seen.has(excerpt) || seen.size >= 5) return;
      seen.add(excerpt);
      $('<button>', { type: 'button', class: 'a6-suggestion', text: excerpt, 'data-match-index': index })
        .appendTo($suggestions);
    });
    $suggestions.prop('hidden', !seen.size);
  }

  function applySearch() {
    const query = String($search.val() || '').trim().replace(/\s+/g, ' ');
    highlightPage(query);
    renderLocalSuggestions(query);
    $previous.prop('disabled', !foundMarks.length);
    $next.prop('disabled', !foundMarks.length);
    $copyResults.prop('disabled', !foundMarks.length);
    $search.attr('aria-expanded', String(Boolean(query && foundMarks.length)));
    if (!query) $searchStatus.text('Search text on this page · Press Enter to jump to a result');
    else if (!foundMarks.length) $searchStatus.text('No matches on this page. Try another word.');
    else {
      setActiveMatch(0, false);
      $searchStatus.text(`${foundMarks.length} match${foundMarks.length === 1 ? '' : 'es'} on this page · Enter to jump`);
    }
  }

  $search.on('input search', applySearch);
  $('#siteSearchClear').on('click', function () {
    $search.val(''); applySearch(); $search.trigger('focus');
  });
  $previous.on('click', () => setActiveMatch(activeIndex - 1, true));
  $next.on('click', () => setActiveMatch(activeIndex + 1, true));
  $search.on('keydown', function (event) {
    if (event.key === 'Escape') { $search.val(''); applySearch(); }
    else if (event.key === 'Enter' && foundMarks.length) {
      event.preventDefault();
      const index = event.shiftKey ? activeIndex - 1 : activeIndex < 0 ? 0 : activeIndex + 1;
      setActiveMatch(index, true);
      $suggestions.prop('hidden', true);
    }
  });
  $suggestions.on('click', '[data-match-index]', function () {
    setActiveMatch(Number($(this).attr('data-match-index')), true);
    $suggestions.prop('hidden', true);
  });
  $search.on('blur', () => window.setTimeout(() => $suggestions.prop('hidden', true), 160));
  $search.on('focus', () => { if ($search.val().trim() && foundMarks.length) renderLocalSuggestions($search.val().trim()); });
  // Practice Lab creates cards after JavaScript loads; refresh after category changes.
  $(document).on('click', '.a5-filter,.faq-question,#faqToggleAll', () => {
    if ($search.val().trim()) window.setTimeout(applySearch, 0);
  });
  applySearch();

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

  // Task 6: a spinner appears only after client-side form validation passes.
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
      toast("Form checked. Your information stays on this device.");
      window.setTimeout(() => $button.prop("disabled", false).html(oldLabel), 950);
    });
  });

  // Task 8: copy text excerpts actually found on the CURRENT page.
  async function writeToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(field);
      field.focus();
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      return copied;
    } catch (_) { return false; }
  }
  $copyResults.on('click', async function () {
    if (!foundMarks.length) return;
    const query = $search.val().trim();
    const lines = [...new Set(foundMarks.map(matchExcerpt))];
    const body = `EnglishLab — matches for "${query}" on ${document.title}\n\n` +
      lines.map((line, i) => `${i + 1}. ${line}`).join('\n');
    const ok = await writeToClipboard(body);
    if (ok) {
      toast(`${lines.length} matching excerpt${lines.length === 1 ? '' : 's'} copied.`);
      $copyResults.text('✓ Copied');
      window.setTimeout(() => $copyResults.text('Copy matches'), 1400);
    } else toast('Copy unavailable. Please check clipboard permissions.');
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
