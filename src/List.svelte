<script lang="ts">
  import { tasks } from './store.js';
  import Task from './Task.svelte';

  let currentTasks: string[];

  tasks.subscribe((value) => {
    currentTasks = value;
  });
</script>

<div>
  {#each currentTasks as task}
    <Task value={task} />
  {/each}
</div>

<style>
</style>