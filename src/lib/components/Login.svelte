<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  let email = ''
  let password = ''
  let remember = false
  let errorMessage = ''

  async function login(): Promise<void> {
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          remember,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        dispatch('success')
      } else {
        throw new Error(JSON.stringify(res))
      }
    } catch (error) {
      console.error(error)
      errorMessage = error
    }
  }
</script>

<h1>Login</h1>

<form on:submit|preventDefault={login}>
  <div class="container">
    <label for="umail"><b>E-Mail</b></label>
    <input type="text" placeholder="Enter Username" name="umail" required bind:value={email} />

    <label for="psw"><b>Password</b></label>
    <input type="password" placeholder="Enter Password" name="psw" required bind:value={password} />

    <button type="submit">Login</button>
    <label>
      <input type="checkbox" name="remember" bind:checked={remember} aria-checked={remember} /> Remember
      me
    </label>
  </div>

  <div class="container" style="background-color:#f1f1f1">
    <button type="button" class="cancelbtn">Cancel</button>
    <span class="psw">Forgot <a href="/reset">password?</a></span>
  </div>
</form>

{#if errorMessage}
  <p>{errorMessage}</p>
{/if}

<style lang="stylus">
h1
  text-align center

form
  border 3px solid #f1f1f1

  input[type=text],
  input[type=password]
    width 100%
    padding 12px 20px
    margin 8px 0
    display inline-block
    border 1px solid #ccc
    box-sizing border-box

button
  background-color #4CAF50
  color white
  padding 14px 20px
  margin 8px 0
  border none
  cursor pointer
  width 100%

button:hover
  opacity 0.8

.cancelbtn
  width auto
  padding 10px 18px
  background-color #f44336

.container
  padding 16px

span.psw
  float right
  padding-top 16px

/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 300px)
  span.psw
     display block
     float none

  .cancelbtn
     width 100%

</style>
