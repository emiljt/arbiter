<script lang="ts">
  import { tasks } from './store.js';

  let totalTasks: number;

  tasks.subscribe((value) => {
    totalTasks = value.length;
  });
</script>

<div class="number">
  <span>Total Tasks: {totalTasks}</span>
</div>

<style>
  .number {
    color: red;
  }
</style>