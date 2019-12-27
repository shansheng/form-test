<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>message:{{message}}</div>
    <div>foo:{{foo}}</div>
  </div>
</template>
<script>

export default {
  data(){
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}
</script>