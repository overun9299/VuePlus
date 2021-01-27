<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品爬虫</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="keyword" placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getJDInfoToES"></el-button>
          </el-input>
        </el-col>
<!--        <el-col :span="4">-->
<!--          <el-button type="primary" @click.native="openAddUserDialog">添加用户</el-button>-->
<!--        </el-col>-->
<!--        <el-col :span="2" class="export_button" @click.native="exportUser">-->
<!--          <el-button type="success">导出</el-button>-->
<!--        </el-col>-->
      </el-row>
<!--      table表格部分-->
      <el-table
          :header-cell-style="{background:'#98b0f6',color:'#526648'}"
          :data="tableData"
          border
          style="width: 100%">
        <el-table-column type="index" label="#" :index="indexMethod" width="39"></el-table-column>
        <el-table-column prop="title" label="商品描述" width="1000"></el-table-column>
        <el-table-column prop="price" label="价格" width="60"></el-table-column>
        <el-table-column prop="imgUrl" label="商品图片" width="360"></el-table-column>
        <el-table-column v-slot="scope"  label="操作" width="100">
<!--          <el-button type="primary" icon="el-icon-edit" circle @click.native="editUser(scope.row)"></el-button>-->
<!--          <el-button type="danger" icon="el-icon-delete" circle></el-button>-->
        </el-table-column>
      </el-table>

      <!--添加弹框-->
<!--      <el-dialog :title="titleMark" :visible.sync="addUserDialog" width="35%" @close="addUserDialogClose">-->
<!--        <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="87px" class="demo-ruleForm">-->
<!--          <el-form-item label="手机号" prop="phoneNum">-->
<!--            <el-input v-model="userForm.phoneNum"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="用户名" prop="userName">-->
<!--            <el-input v-model="userForm.userName"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="昵称" prop="nickName">-->
<!--            <el-input v-model="userForm.nickName" placeholder="昵称默认手机号"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="密码" prop="password">-->
<!--            <el-input v-model="userForm.password" ></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-row style="margin-left: -87px">-->
<!--              <el-col :span="11" >-->
<!--                <el-form-item label="默认验证码" prop="verificationCode" >-->
<!--                  <el-input v-model="userForm.verificationCode" ></el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="11">-->
<!--                <el-form-item label="优先级" prop="priority">-->
<!--                  <el-select v-model="userForm.priority" placeholder="请选择">-->
<!--                    <el-option-->
<!--                        v-for="item in priorityOptions"-->
<!--                        :key="item.value"-->
<!--                        :label="item.label"-->
<!--                        :value="item.value">-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->

<!--          </el-form-item>-->

<!--          <el-form-item label="备注" prop="remark">-->
<!--            <el-input v-model="userForm.remark"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--        <span slot="footer" class="dialog-footer">-->
<!--                    <el-button @click="addUserDialog = false">取 消</el-button>-->
<!--                    <el-button type="primary" @click="addUser">确 定</el-button>-->
<!--                </span>-->
<!--      </el-dialog>-->

      <!--分页-->
      <div class="block">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="GoodsQuery.page"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="GoodsQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "goodsReptile",
  data() {
    return {
      //查寻总数
      total: 0,
      tableData: [],
      GoodsQuery: {
        page: 1,
        limit: 10,
        keyword:''
      },
      keyword:''
    }
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    getJDInfoToES() {
      let param = {
        keyWord:this.keyword
      }
      this.$get("/ms/search/goods/getJDInfoToES",param
                  ).then(res=>{
        console.log(res)
      })
    },

    getGoodsList() {
      this.$post("/ms/business/goods/getGoodsListByPage",this.GoodsQuery).then(res => {
        console.log(res);
        this.total = res.data.total;
        this.tableData = res.data.records;
      })
    },

    // 修改每页多少条
    handleSizeChange(val) {
      this.GoodsQuery.limit = val;
      this.getGoodsList();
    },
    // 跳转第几页
    handleCurrentChange(val) {
      this.GoodsQuery.page = val;
      this.getGoodsList();
    },
    indexMethod(index) {
      return index + 1;
    },
  }


}
</script>

<style scoped>

</style>