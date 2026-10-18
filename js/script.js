
/* HerBody, HerKnowledge - Improved Website Search */

document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("site-search");
    const searchResults = document.getElementById("search-results");

    if (!searchForm || !searchInput || !searchResults) {
        return;
    }

    const pages = [
        { title: "Home", url: "index.html" },
        { title: "PMOS / PCOS", url: "pcos.html" },
        { title: "Endometriosis", url: "endometriosis.html" },
        { title: "Symptoms", url: "symptoms.html" },
        { title: "Comparison", url: "comparison.html" },
        { title: "Symptom Awareness", url: "awareness.html" },
        { title: "Frequently Asked Questions", url: "faq.html" },
        { title: "Resources", url: "resources.html" },
        { title: "References", url: "references.html" }
    ];

    const relatedTerms = {
        menstruation: ["menstruation", "menstrual", "period", "periods"],
        menstrual: ["menstruation", "menstrual", "period", "periods"],
        periods: ["periods", "period", "menstrual", "menstruation"],
        period: ["period", "periods", "menstrual", "menstruation"],
        fertility: ["fertility", "fertile", "infertility"],
        hormones: ["hormone", "hormones", "hormonal"],
        symptoms: ["symptom", "symptoms", "sign", "signs"],
        treatment: ["treatment", "treatments", "management", "manage"],
        diagnosis: ["diagnosis", "diagnose", "diagnostic"],
        pain: ["pain", "painful", "pelvic pain"],
        pcos: ["pcos", "polycystic", "polyendocrine metabolic ovarian syndrome"],
        pmos: ["pmos", "polyendocrine metabolic ovarian syndrome"]
    };

    function getSearchTerms(query) {
        const words = query.toLowerCase().trim().split(/\s+/);
        const terms = new Set(words);

        words.forEach(function (word) {
            if (relatedTerms[word]) {
                relatedTerms[word].forEach(function (term) {
                    terms.add(term);
                });
            }
        });

        return Array.from(terms).filter(function (term) {
            return term.length > 0;
        });
    }

    
function createResult(page, preview, query) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const description = document.createElement("p");

    link.href = page.url;
    link.textContent = page.title;

    const lowerPreview = preview.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let start = 0;
    let matchIndex;

    while (
        lowerQuery.length > 0 &&
        (matchIndex = lowerPreview.indexOf(lowerQuery, start)) !== -1
    ) {
        description.appendChild(
            document.createTextNode(
                preview.slice(start, matchIndex)
            )
        );

        const highlight = document.createElement("mark");
        highlight.textContent = preview.slice(
            matchIndex,
            matchIndex + query.length
        );

        description.appendChild(highlight);
        start = matchIndex + query.length;
    }

    description.appendChild(
        document.createTextNode(preview.slice(start))
    );

    item.appendChild(link);
    item.appendChild(description);

    return item;
}


    searchForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const query = searchInput.value.trim().toLowerCase();
        searchResults.replaceChildren();

        if (!query) {
            searchResults.textContent =
                "Please enter a word or phrase to search.";
            return;
        }

        const terms = getSearchTerms(query);
        const results = [];

        searchResults.textContent = "Searching website content...";

        for (const page of pages) {
            try {
                const response = await fetch(page.url);

                if (!response.ok) {
                    continue;
                }

                const html = await response.text();
                const pageDocument = new DOMParser().parseFromString(
                    html,
                    "text/html"
                );

                const content = pageDocument.body.textContent
                    .replace(/\s+/g, " ")
                    .trim();

                const lowerContent = content.toLowerCase();

                const matchedTerms = terms.filter(function (term) {
                    return lowerContent.includes(term);
                });

                if (matchedTerms.length === 0) {
                    continue;
                }

                let score = 0;

                if (lowerContent.includes(query)) {
                    score += 10;
                }

                matchedTerms.forEach(function (term) {
                    const position = lowerContent.indexOf(term);

                    if (position !== -1) {
                        score += 1;

                        let nextPosition = position + term.length;

                        while (nextPosition < lowerContent.length) {
                            const foundAt = lowerContent.indexOf(
                                term,
                                nextPosition
                            );

                            if (foundAt === -1) {
                                break;
                            }

                            score += 1;
                            nextPosition = foundAt + term.length;
                        }
                    }
                });

                const firstMatch = lowerContent.indexOf(matchedTerms[0]);
                const start = Math.max(0, firstMatch - 60);
                const end = Math.min(
                    content.length,
                    firstMatch + matchedTerms[0].length + 100
                );

                let preview = content.slice(start, end).trim();

                if (start > 0) {
                    preview = "..." + preview;
                }

                if (end < content.length) {
                    preview += "...";
                }

                results.push({
                    page: page,
                    preview: preview,
                    score: score
                });
            } catch (error) {
                console.error("Could not search " + page.url, error);
            }
        }

        results.sort(function (a, b) {
            return b.score - a.score;
        });

        searchResults.replaceChildren();

        if (results.length === 0) {
            searchResults.textContent =
                "No matching content found. Try symptoms, periods, hormones, or fertility.";
            return;
        }

        const heading = document.createElement("h3");
        heading.textContent = "Search Results (" + results.length + ")";
        searchResults.appendChild(heading);

        const resultList = document.createElement("ul");

        results.forEach(function (result) {
            resultList.appendChild(
               createResult(result.page, result.preview, query)
            );
        });

        searchResults.appendChild(resultList);
    });
});


/* Symptom Awareness Checklist */

document.addEventListener("DOMContentLoaded", function () {
    const awarenessForm = document.getElementById("awareness-form");
    const awarenessFeedback = document.getElementById("awareness-feedback");

    if (!awarenessForm || !awarenessFeedback) {
        return;
    }

    awarenessForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedSymptoms = awarenessForm.querySelectorAll(
            'input[name="symptom"]:checked'
        );

        awarenessFeedback.replaceChildren();

        const message = document.createElement("p");

        if (selectedSymptoms.length === 0) {
            message.textContent =
                "Please select any statements that apply to your experience before reviewing your selections.";
        } else {
            message.textContent =
                "You have reviewed your symptom observations. The symptoms you selected do not confirm a diagnosis of PCOS or Endometriosis. Consider keeping a record of changes, including when they occur and how they affect your daily activities. If symptoms are persistent, severe, or interfere with your usual activities, speak with a qualified healthcare professional.";
        }

        awarenessFeedback.appendChild(message);
    });

    awarenessForm.addEventListener("reset", function () {
        awarenessFeedback.replaceChildren();
    });
});

