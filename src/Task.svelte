<script lang="ts">
    import { Square } from 'lucide-svelte';

    export let value: string = '';
</script>

<div>
    <p><Square /> { value }</p>
</div>

<style>
</style>