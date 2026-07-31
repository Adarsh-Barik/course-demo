---
title: Practice Arena 🎮
nav_order: 7
permalink: /practice/
---

<link rel="stylesheet"
      href="{{ site.baseurl }}/practice/style.css">

# 🎮 COL1000 Practice Arena

Earn XP, unlock badges, and revise Python through interactive challenges.

<div class="dashboard">

<div>
⭐ XP:
<span id="xp">0</span>
</div>

<div>
🏅 Badges:
<span id="badge-count">0</span>
</div>

</div>

<div class="topic-grid">

<a class="topic-card featured-card"
   href="{{ site.baseurl }}/practice/all-questions.html">

<h2>📚 Question Bank</h2>

<p>
Browse all questions organized by topic and difficulty.
</p>

<p>
Practice in any order.
</p>

</a>

<a class="topic-card"
   href="{{ site.baseurl }}/practice/topic.html?topic=variables">

<h3>Variables</h3>

<p>9 Questions</p>

</a>

<a class="topic-card"
   href="{{ site.baseurl }}/practice/topic.html?topic=conditionals">

<h3>Conditionals</h3>

<p>9 Questions</p>

</a>

<a class="topic-card"
   href="{{ site.baseurl }}/practice/topic.html?topic=loops">

<h3>Loops</h3>

<p>9 Questions</p>

</a>

<a class="topic-card"
   href="{{ site.baseurl }}/practice/topic.html?topic=lists">

<h3>Lists</h3>

<p>9 Questions</p>

</a>

</div>

<script>

document.addEventListener("DOMContentLoaded",()=>{

    document.getElementById("xp").textContent =
        localStorage.getItem("xp") || 0;

    const badges =
        JSON.parse(
            localStorage.getItem("badges")
            || "[]"
        );

    document.getElementById("badge-count")
        .textContent =
        badges.length;

});

</script>
