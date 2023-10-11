<script lang="ts">
  import { tasks } from './store.js';

  let currentTasks: string[];

  tasks.subscribe((value) => {
    currentTasks = value;
  });
</script>

<div>
  <h1>Task List</h1>

  <ul>
    {#each currentTasks as task}
      <!-- <li><input type="checkbox" disabled /><span>{task}</span></li> -->
      <li><span>{task}</span></li>
    {/each}
  </ul>
</div>

<style>
  li {
    margin-bottom: var(--arbiter-px-grid-4x2);
    padding-top: var(--arbiter-px-grid-4x2);
    padding-left: var(--arbiter-px-grid-4x2);
    list-style: none;
  }

  li:hover {
    background-color: var(--arbiter-bg-2);
  }

  span {
    display: inline-block;
    width: calc(100% - var(--arbiter-px-grid-4x12));
    padding-bottom: var(--arbiter-px-grid-4x3);
    border-bottom-style: solid;
    border-bottom-width: var(--arbiter-border-width);
    border-bottom-color: var(--arbiter-bg-2);
  }

  /* input[type=checkbox] {
    position: relative;
    top: 0.2em;
    margin-right: 0.6em;
  } */
</style>