#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

using namespace std;

void coutvec(vector<int> vec){
    cout << "{";
    for(int i : vec){
        cout << i << ", ";
    }
    cout << "}" << endl;
}
void coutvecvec(vector<vector<int>> vecv){
    cout << "{" << endl;
    for(vector<int> v : vecv){
        coutvec(v);
    }
    cout << "}" << endl;
}

class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size();
        if(n == 1) return;
        int i = n - 2;
        while(i > - 1){
            if(nums[i] < nums[i + 1]){
                int l = i + 1;
                int r = n;
                while(r - l > 1){
                    if(nums[(l + r) / 2] <= nums[i]){
                        r = (l + r) / 2;
                    }else{
                        l = (l + r) / 2;
                    }
                }
                int c = nums[l];
                nums[l] = nums[i];
                nums[i] = c;
                int d = i + 1;
                int he = d + n - 1;
                while(d < he - d){
                    int c = nums[d];
                    nums[d] = nums[he - d];
                    nums[he - d] = c;
                    d++;
                }
                return;
            }
            i--;
        }
        int d = 0;
        int he = n - 1;
        while(d < he - d){
            int c = nums[d];
            nums[d] = nums[he - d];
            nums[he - d] = c;
            d++;
        }
    }
};

int main(int argc, char const *argv[])
{
    Solution so;
    int q = 1463847412;
    vector<int> nums = {3,1,2,0};
    string s = "abcdbbdcaaa";
    so.nextPermutation(nums);
    coutvec(nums);
    return 0;
}
