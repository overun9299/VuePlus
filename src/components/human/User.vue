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
                    <el-input placeholder="请输入内容" clearable>
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click.native="openAddUserDialog">添加用户</el-button>
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
                <el-table-column prop="verificationCode" label="验证码" width="180"></el-table-column>
                <el-table-column v-slot="scope" label="优先级" width="180">
                    {{scope.row.priority|getPriority}}
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="360"></el-table-column>
                <el-table-column v-slot="scope"  label="操作" width="180">
                    <el-button type="primary" icon="el-icon-edit" circle @click.native="editUser(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle></el-button>
                </el-table-column>
            </el-table>

            <!--添加弹框-->
            <el-dialog :title="titleMark" :visible.sync="addUserDialog" width="35%" @close="addUserDialogClose">
                <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="87px" class="demo-ruleForm">
                    <el-form-item label="手机号" prop="phoneNum">
                        <el-input v-model="userForm.phoneNum"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="userName">
                        <el-input v-model="userForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称" prop="nickName">
                        <el-input v-model="userForm.nickName" placeholder="昵称默认手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="userForm.password" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="11" >
                            <el-form-item label="默认验证码" prop="verificationCode" >
                                <el-input v-model="userForm.verificationCode" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="优先级" prop="priority">
                                <el-select v-model="userForm.priority" placeholder="请选择">
                                    <el-option
                                            v-for="item in priorityOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="userForm.remark"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addUserDialog = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>

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
                },
                // 控制弹出框显隐
                addUserDialog: false,
                titleMark: '',
                // user添加
                userForm: {
                    nickName: '',
                    phoneNum: '',
                    userName: '',
                    password: '',
                    remark: '',
                    verificationCode: '',
                    priority: ''
                },
                // 表单校验
                rules: {
                    phoneNum: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { min: 11, max: 11, message: '长度11个字符', trigger: 'blur' }],
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }]
                },
                // 优先级选项
                priorityOptions: [{
                    value: '1',
                    label: '最低'
                }, {
                    value: '2',
                    label: '默认'
                }, {
                    value: '3',
                    label: '稍高'
                }, {
                    value: '4',
                    label: '高'
                }, {
                    value: '5',
                    label: '最高'
                }],

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
                    url: 'ms/user/user/lockOrUnLockUser',
                    params: {
                        userId: v2,
                        lockedState: val
                    }
                }).then((res) => {
                    if (res.data.success) {
                        this.$message({
                            type: 'success',
                            message: val ? '锁定成功' : '解锁成功'
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
                    url: "ms/export/user/getPersonListForExport",
                    params: this.userQuery
                }).then((res) => {
                    console.log(res.data)
                })
            },
            // 添加用户弹框
            openAddUserDialog() {
                this.addUserDialog = true;
                this.titleMark = '添加用户';
            },

            // 添加用户
            addUser() {
                this.$refs.userFormRef.validate(valid =>{
                    if (!valid) return
                    // 调用真正的添加请求
                    this.axios({
                        method: "POST",
                        url: "ms/user/user/addUserByPhone",
                        params: this.userForm
                    }).then((res) => {
                        if (res.data.success) {
                            this.$message({
                                type: 'success',
                                message: '添加成功!'
                            });
                            // 关闭弹框
                            this.addUserDialog=false
                            //刷新列表
                            this.getUserList();

                            // this.addUserDialogClose();
                        } else {
                            this.$message({
                                type: 'error',
                                message: '添加失败!'
                            });
                        }
                    })
                })
            },
            // 修改用户
            editUser(val) {
                this.userForm = val;
                this.addUserDialog = true;
                this.titleMark = '修改用户';
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
                    url: "ms/user/user/getUserListByPage",
                    params: this.userQuery
                }).then((res) => {
                    this.total = res.data.data.total;
                    this.tableData = res.data.data.records;
                })
            },
            // 关闭弹框清除表单
            addUserDialogClose() {
                this.$refs.userFormRef.resetFields();
            },

        }
    }
</script>

<style lang="less" scoped>

    .export_button {
        float: right;
    }

</style>
