<template>
  <el-container>
    <el-header>
      <el-menu class="el-menu-demo" mode="horizontal" >
        <el-menu-item index="1">
          <router-link to="/">Home</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/btc">BTC</router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link to="/ckb">CKB</router-link>
        </el-menu-item>
        <el-menu-item index="4">
          <router-link to="/doge">DOGE</router-link>
        </el-menu-item>
      </el-menu>
    </el-header>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
