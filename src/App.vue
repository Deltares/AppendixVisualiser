<template>

  <div  id="Main">
    <b-navbar toggleable="lg" sticky type="light" variant="light">
      <b-navbar-brand href="#"><img src="./assets/logo_deltares.png" alt="DeltaresLogo" class="logo"></b-navbar-brand>
<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
<b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <!--<b-nav-item to="/" :active="path == '/'">Home</b-nav-item>
          <b-nav-item to="/search" :active="path == '/search'">Search</b-nav-item>
      -->
        <b-nav-item disabled>Appendix 1</b-nav-item>
        <b-nav-item disabled>Appendix 2</b-nav-item>
        <b-nav-item disabled>Appendix 3</b-nav-item>
        <b-nav-item href="https://deltares.nl" target="_blank">Bezoek Deltares.nl</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  
    <demoDash/>
    <img src="./assets/Deltares_pay-off_D-blauw_RGB.svg" alt="DeltaresLogo" class="payoff">
  </div>

</template>

<script>
import demoDash from './components/demo-dash.vue';


export default {
    name: 'App',
    components: {
       demoDash,
    }
    
}

</script>

<style>

.logo {
  max-width: 150px;
}

.payoff{
  position: fixed;
  right: 20px;
  bottom: 10px;
  width: 15%;
}

#Main {
  font-family: Helvetica, Arial, sans-serif;
}

b-navbar{
    background-color: white;

}

</style>