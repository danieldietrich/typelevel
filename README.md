<div id="typelevel-logo" align="center">
  <a href="https://github.com/danieldietrich/typelevel">
    <img alt="Typelevel Logo" width="450" src="https://user-images.githubusercontent.com/743833/196011589-ea9308f1-cc96-4732-823f-bf4b83a2517d.png">
  </a>
  <h3>
    Lift your code to the next level.
  </h3>
</div>

<br/>
<br/>

<div id="badges" align="center">

[![npm version](https://img.shields.io/npm/v/typescript-typelevel?logo=npm&style=flat-square)](https://www.npmjs.com/package/typescript-typelevel/)
[![build](https://img.shields.io/github/workflow/status/danieldietrich/typelevel/Test/main?logo=github&style=flat-square)](https://github.com/danieldietrich/typelevel/actions/workflows/test.yml)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod&style=flat-square)](https://gitpod.io/#https://github.com/danieldietrich/typelevel)

</div>

<style>
  .glow-on-hover {
    width: 220px;
    height: 50px;
    border: none;
    outline: none;
    color: #fff;
    background: #111;
    cursor: pointer;
    position: relative;
    z-index: 0;
    border-radius: 10px;
  }

  .glow-on-hover:before {
      content: '';
      background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
      position: absolute;
      top: -2px;
      left:-2px;
      background-size: 400%;
      z-index: -1;
      filter: blur(5px);
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      animation: glowing 20s linear infinite;
      opacity: 0;
      transition: opacity .3s ease-in-out;
      border-radius: 10px;
  }

  .glow-on-hover:active {
      color: #000
  }

  .glow-on-hover:active:after {
      background: transparent;
  }

  .glow-on-hover:hover:before {
      opacity: 1;
  }

  .glow-on-hover:after {
      z-index: -1;
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: #111;
      left: 0;
      top: 0;
      border-radius: 10px;
  }

  @keyframes glowing {
      0% { background-position: 0 0; }
      50% { background-position: 400% 0; }
      100% { background-position: 0 0; }
  }
</style>

<button class="glow-on-hover" type="button">https://typelevel.io</button>

<h3>
<a href="#" style="background-color:#7892c2; border-radius:11px; border:1px solid #4e6096; display:inline-block; cursor:pointer; color:#ffffff; font-family:Arial; font-size:28px font-weight:bold; padding:15px 48px; text-decoration:none;"><span style="color:rgba(255,255,255,0.5)" onMouseOver="this.style.background-color='#476e9e'" onMouseOver="this.style.color='#7892c2'">https://</span>typelevel.io</a>
</h3>
