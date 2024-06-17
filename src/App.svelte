<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let searchInput: HTMLInputElement;
  let searchInputValue = "";

  const word = writable("");
  onMount(async () => {
    chrome.storage.session.onChanged.addListener(async (changes) => {
      const lastWordChange = changes["word"];
      if (!lastWordChange) {
        return;
      }
      word.set(lastWordChange.newValue);
    });

    searchInput.focus();
  });
</script>

<div class="popup">
  <h1>Svelte Extension Demo</h1>
  <input
    bind:this={searchInput}
    bind:value={searchInputValue}
    type="text"
    class="search-input"
  />
  <button>Click me</button>
  <div>
    <p id="definition">Hovered word: {$word}</p>
  </div>
</div>

<style>
  .popup {
    /* width: 640px; */
    /* height: 480px; */
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
