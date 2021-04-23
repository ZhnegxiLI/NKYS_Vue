<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="searchCriteria.Year"
        placeholder="年"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-select
        v-model="searchCriteria.Validity"
        placeholder="是否有效"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option :key="true" label="是" :value="true" />
        <el-option :key="false" label="否" :value="false" />
      </el-select>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleUpdateCreate"
      >
        添加
      </el-button>
       <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="Danger"
        icon="el-icon-edit"
        @click="resetSearchCriteria"
      >
        重置
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" prop="Id" sortable align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周期名字" width="150px" align="center" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.Label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年" min-width="150px" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.Year }}</span>
        </template>
      </el-table-column>
      <el-table-column el-table-column label="月" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.Month }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showReviewer"
        label="起始日期"
        width="110px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.FromDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.ToDate }}</span>
        </template>
      </el-table-column>

      <el-table-column v-for="productValue in productValueTypeList" :key="productValue.Value" :label="productValue.Label" width="80px">
        <template slot-scope="{ row }">
          <span>{{ row[productValue.Code] }}</span>
        </template>
      </el-table-column>


      <el-table-column label="是否有效" width="80px" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.Validity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准工作时" width="80px" sortable>
        <template slot-scope="{ row }">
          <span>{{ row.StandardWorkingHours }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdateCreate(row)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="cycleObj.Id > 0 ? '更新' : '创建'"
      :visible.sync="dialogCycleFormVisible"
    >
      <el-form
        ref="cycleObj"
        :rules="rules"
        :model="cycleObj"
        label-position="left"
        label-width="100px"
      >

        <el-form-item label="周期名字" prop="Label">
          <el-input v-model="cycleObj.Label" />
        </el-form-item>
        <el-form-item label="* 周期时间" prop="DateValidation">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="起始日期"
              v-model="cycleObj.FromDate"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col style="text-align: center" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="结束日期"
              v-model="cycleObj.ToDate"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="标准工作时" prop="StandardWorkingHours">
          <el-input v-model.number="cycleObj.StandardWorkingHours" />
        </el-form-item>
        <el-checkbox v-model="cycleObj.Validity">是否有效</el-checkbox>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCycleFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="createUpdateCycle ()"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { getCycles, createOrEditCycle } from "@/api/cycle";
const productValueTypeList = [{
  Value : 0,
  Code: 'Banjing',
  Label: '钣金'
},{
  Value : 1,
  Code: 'Chengtao',
  Label: '成套'
},
{
  Value : 2,
  Code: 'Huikuan',
  Label: '回款'
}];
export default {
  name: "CyclesTable",
  directives: { waves },
  data() {
    var validateCycleFormDate = (rule, value, callback) => {
      let validity = true;
      if (
        this.cycleObj.FromDate != null &&
        this.cycleObj.ToDate != null &&
        this.cycleObj.FromDate > this.cycleObj.ToDate
      ) {
        validity = false;
        callback(new Error("起始日期不能大于结束日期"));
      } else {
        if (this.cycleObj.FromDate == null) {
          callback(new Error("起始日期不能为空"));
        }
        if (this.cycleObj.ToDate == null) {
          callback(new Error("结束日期不能为空"));
        }
      }
      callback();
    };
    return {
      list: null,
      total: 0,
      listLoading: true,
      searchCriteria: {
        Year: null,
        Validity: null,
        Id: null,
      },
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      cycleObj: {
        Id: 0,
        Label: "",
        FromDate: null,
        ToDate: null,
        Validity: true,
        StandardWorkingHours: null,
      },
      dialogCycleFormVisible: false,
      textMap: {
        update: "Edit",
        create: "Create",
      },
      rules: {
        Label: [
          { required: true, message: "周期标题为必须", trigger: "change" },
        ],
        DateValidation: [
          {
            trigger: "blur",
            validator: validateCycleFormDate,
          },
        ],
        StandardWorkingHours: [
          { type: "number", message: "标准工作时为数字", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // todo add param
      getCycles(this.searchCriteria).then((result) => {
        if (result != null && result.length > 0) {
          this.list = result;
        } else {
          this.list = [];
        }
        this.listLoading = false;
      });
    },
    handleFilter() {
      //this.listQuery.page = 1
      this.getList();
    },
    resetSearchCriteria() {
      this.searchCriteria = {
        Year: null,
        Validity: null,
        Id: null,
      };
    },
    resetTemp() {
      this.cycleObj = {
        Id: 0,
        Label: "",
        FromDate: null,
        ToDate: null,
        Validity: true,
        StandardWorkingHours: null,
      };
    },
    handleUpdateCreate(row) {
      this.resetTemp();
      if(row!=null && row.Id>0){
        this.cycleObj = Object.assign({}, row); // copy obj
      }
      this.dialogCycleFormVisible = true;
      this.$nextTick(() => {
           this.$refs["cycleObj"].clearValidate();
      });
    },
    createUpdateCycle() {
      this.$refs["cycleObj"].validate((valid) => {
        if (valid) {
          createOrEditCycle(this.cycleObj).then((result) => {
            if (result > 0) {
              this.$notify({
                title: "成功",
                message: this.cycleObj.Id>0? "更新成功": "创建成功",
                type: "success",
                duration: 2000,
              });
              this.dialogCycleFormVisible = false;
              // Refresh list 
              this.getList();
            }
            else{
                this.$notify({
                title: "失败",
                message: "创建失败",
                type: "fail",
                duration: 2000,
              });
            }
          });
        }
      });
    }
  },
};
</script>
