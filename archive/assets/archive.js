const searchInput = document.querySelector("[data-archive-search]");
const items = [...document.querySelectorAll("[data-archive-item]")];
const emptyState = document.querySelector("[data-empty-state]");
const visibleCount = document.querySelector("[data-visible-count]");

function updateArchiveList() {
  const query = searchInput?.value.trim().toLocaleLowerCase() ?? "";
  let count = 0;

  for (const item of items) {
    const matches = !query || item.textContent.toLocaleLowerCase().includes(query);
    item.hidden = !matches;
    if (matches) count += 1;
  }

  if (emptyState) emptyState.hidden = count !== 0;
  if (visibleCount) visibleCount.textContent = `${count} item${count === 1 ? "" : "s"}`;
}

searchInput?.addEventListener("input", updateArchiveList);
updateArchiveList();
