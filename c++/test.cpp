#include <iostream>
#include <chrono>
#include <thread>
using namespace std::chrono;

int a = 1, b = 2;


void test(){
    int c = a;
    a = b;
    b = c;
}

int main() {
    // "start" and "end"'s type is std::chrono::time_point
    time_point<system_clock> start = system_clock::now();
    {   
        test();
        std::cout << a << " , " << b << "\n";
        for(int i = 0; i < 100000000; i++){
            test();
        }
    }
    time_point<system_clock> end = system_clock::now();

    std::chrono::duration<double> elapsed = end - start;
    std::cout << "Elapsed time: " << elapsed.count() << "s";

    return 0;
}
