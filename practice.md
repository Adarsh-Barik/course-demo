---
title: Practice Arena 🎮
nav_order: 7
permalink: /practice/
---

<h1>🎮 COL1000 Practice Arena</h1>

<p>
Earn XP, unlock badges, and revise Python through interactive challenges.
</p>

<div id="stats">
    <strong>XP:</strong> <span id="xp">0</span>
    &nbsp;&nbsp;
    <strong>Badges:</strong> <span id="badge-count">0</span>
</div>

<div class="topic-grid">

<a class="topic-card featured-card"
   href="{{ site.baseurl }}/practice/all-questions.html">

    <h2>📚 Question Bank</h2>

    <p>
        Browse all practice questions organized by topic and difficulty.
    </p>

    <p>
        No XP • No hints • No progression
    </p>

</a>

  <a class="topic-card" href="{{ site.baseurl }}/practice/topic.html?topic=variables">
    <h3>Variables</h3>
    <p>9 Questions</p>
  </a>

  <a class="topic-card" href="{{ site.baseurl }}/practice/topic.html?topic=conditionals">
    <h3>Conditionals</h3>
    <p>9 Questions</p>
  </a>

  <a class="topic-card" href="{{ site.baseurl }}/practice/topic.html?topic=loops">
    <h3>Loops</h3>
    <p>9 Questions</p>
  </a>

  <a class="topic-card" href="{{ site.baseurl }}/practice/topic.html?topic=lists">
    <h3>Lists</h3>
    <p>9 Questions</p>
  </a>

</div>

<link rel="stylesheet"
      href="{{ site.baseurl }}/practice/style.css">

<script>

document.addEventListener("DOMContentLoaded",()=>{

    document.getElementById("xp").textContent =
        localStorage.getItem("xp") || 0;

    let badges = JSON.parse(
        localStorage.getItem("badges") || "[]"
    );

    document.getElementById("badge-count")
        .textContent = badges.length;
});

</script>
