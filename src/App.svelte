<script lang="ts">
  import { onMount } from "svelte";

  let searchInput: HTMLInputElement;
  let searchInputValue = "";

  onMount(async () => {
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
