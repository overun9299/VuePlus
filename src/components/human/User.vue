<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>人员管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" clearable >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
                <el-col :span="2" class="export_button" @click.native="exportUser">
                    <el-button type="success">导出</el-button>
                </el-col>
            </el-row>
            <!--table表格部分-->
            <el-table
                    :header-cell-style="{background:'#98b0f6',color:'#526648'}"
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column type="index" label="#" :index="indexMethod"></el-table-column>
                <el-table-column prop="nickName" label="姓名" width="180"></el-table-column>
                <el-table-column prop="phoneNum" label="手机" width="180"></el-table-column>
                <el-table-column v-slot="scope" label="状态" width="180">
                    <el-switch
                            v-model="scope.row.isLocked"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            @change="isLockedChange(scope.row.isLocked, scope.row.id)">
                    </el-switch>
                </el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
            </el-table>

            <!--分页-->
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="userQuery.page"
                        :page-sizes="[5, 10, 20, 50, 100]"
                        :page-size="userQuery.limit"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "User",
        data() {
            return {
                //查寻总数
                total: 0,
                tableData: [],
                userQuery: {
                    page: 1,
                    limit: 10
                }
            }
        },
        created() {
            this.getUserList();
        },
        methods: {
            //锁定、解锁用户
            isLockedChange(val, v2) {
                    this.axios({
                        method: 'POST',
                        url: 'user/user/lockOrUnLockUser',
                        params : {
                            userId: v2,
                            lockedState: val
                        }
                    }).then((res) =>{
                        if (res.data.success) {
                            this.$message({
                                type: 'success',
                                message: val?'锁定成功':'解锁成功'
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: '操作失败!'
                            });
                        }
                    })
            },
            //导出用户
            exportUser() {
                this.axios({
                    method: "POST",
                    url: "export/user/getPersonListForExport",
                    params: this.userQuery
                }).then((res) =>{
                    console.log(res.data)
                })
            },

            // 修改每页多少条
            handleSizeChange(val) {
                this.userQuery.limit = val;
                this.getUserList();
            },
            // 跳转第几页
            handleCurrentChange(val) {
                this.userQuery.page = val;
                this.getUserList();
            },
            indexMethod(index) {
                return index + 1;
            },

            getUserList() {
                this.axios({
                    method: "POST",
                    url: "user/user/getUserListByPage",
                    params: this.userQuery
                }).then((res) =>{
                    this.total = res.data.data.total;
                    this.tableData = res.data.data.records;
                })
            }
        }
    }
</script>

<style lang="less" scoped>

    .export_button {
        float: right;
    }
</style>
