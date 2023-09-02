<script lang="ts">
  import { tasks } from './store.js';
  import Task from './Task.svelte';

  let currentTasks: string[];

  tasks.subscribe((value) => {
    currentTasks = value;
  });
</script>

<div>
  <h1>Task List</h1>

  <ul>
    {#each currentTasks as task}
      <li><input type="checkbox" /><span>{task}</span></li>
    {/each}
  </ul>
</div>

<style>
  li {
    margin-bottom: var(--size-4-2);
    padding-top: var(--size-4-2);
    padding-left: var(--size-4-2);
    list-style: none;
  }

  li:hover {
    background-color: var(--background-secondary);
  }

  span {
    display: inline-block;
    width: calc(100% - var(--size-4-12));
    padding-bottom: var(--size-4-3);
    border-bottom-style: solid;
    border-bottom-width: var(--border-width);
    border-bottom-color: var(--background-secondary);
  }

  input[type=checkbox] {
    position: relative;
    top: 0.2em;
    margin-right: 0.6em;
  }
</style>